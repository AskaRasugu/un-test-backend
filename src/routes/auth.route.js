// Auth routes: register and login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const config = require('../config');

// register new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if(!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
  stmt.run([name,email,hashed,role], function(err){
    if(err) return res.status(400).json({ error: 'Registration failed' });
    const user = { id: this.lastID, name, email, role };
    const token = jwt.sign(user, config.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user });
  });
});

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = jwt.sign(user, config.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user });
  });
});

module.exports = router;
