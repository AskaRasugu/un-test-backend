const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret"; 
const db = new sqlite3.Database(":memory:");

// init schema
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT)");
  db.run("CREATE TABLE projects (id INTEGER PRIMARY KEY, title TEXT, status TEXT)");
  db.run("CREATE TABLE expenditures (id INTEGER PRIMARY KEY, projectId INTEGER, amount REAL, description TEXT)");
  db.run("INSERT INTO projects (title,status) VALUES ('Market Road Project','In Progress')");
});

function auth(required = []) {
  return (req,res,next) => {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({error:"Missing token"});
    try {
      const token = header.split(" ")[1];
      const user = jwt.verify(token, SECRET);
      if(required.length && !required.includes(user.role)) {
        return res.status(403).json({error:"Forbidden"});
      }
      req.user = user;
      next();
    } catch(e){ res.status(401).json({error:"Invalid token"}); }
  };
}

app.post("/api/register", async (req,res)=>{
  const {name,email,password,role} = req.body;
  const hashed = await bcrypt.hash(password,10);
  db.run("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",[name,email,hashed,role],function(err){
    if(err) return res.status(400).json({error:"Registration failed"});
    const user = {id:this.lastID,name,email,role};
    const token = jwt.sign(user,SECRET,{expiresIn:"6h"});
    res.json({token,user});
  });
});

app.post("/api/login", (req,res)=>{
  const {email,password} = req.body;
  db.get("SELECT * FROM users WHERE email=?",[email], async (err,row)=>{
    if(!row) return res.status(401).json({error:"Invalid"});
    const ok = await bcrypt.compare(password,row.password);
    if(!ok) return res.status(401).json({error:"Invalid"});
    const user = {id:row.id,name:row.name,email:row.email,role:row.role};
    const token = jwt.sign(user,SECRET,{expiresIn:"6h"});
    res.json({token,user});
  });
});

app.post("/api/projects/:id/expenditures", auth(["unhabitat"]), (req,res)=>{
  const {amount,description} = req.body;
  db.run("INSERT INTO expenditures (projectId,amount,description) VALUES (?,?,?)",[req.params.id,amount,description],function(err){
    if(err) return res.status(400).json({error:"Failed"});
    res.json({id:this.lastID,amount,description});
  });
});

app.patch("/api/projects/:id/status", auth(["unhabitat"]), (req,res)=>{
  const {status} = req.body;
  db.run("UPDATE projects SET status=? WHERE id=?",[status,req.params.id],function(err){
    if(err) return res.status(400).json({error:"Failed"});
    res.json({id:req.params.id,status});
  });
});

app.get("/api/projects", auth(), (req,res)=>{
  db.all("SELECT * FROM projects",[],(err,rows)=>res.json(rows));
});

app.get("/api/projects/:id/expenditures", auth(), (req,res)=>{
  db.all("SELECT * FROM expenditures WHERE projectId=?",[req.params.id],(err,rows)=>res.json(rows));
});

app.listen(4000,()=>console.log("Server running on 4000"));
