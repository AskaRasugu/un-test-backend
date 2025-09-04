// Creates tables if not exist
const fs = require('fs');
const path = require('path');
const db = require('./db');

const migrate = () => new Promise((resolve, reject) => {
  const sql = fs.readFileSync(path.join(__dirname,'schema.sql')).toString();
  db.exec(sql, (err) => {
    if (err) return reject(err);
    resolve();
  });
});

module.exports = { migrate };
