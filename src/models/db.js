// DB helper using sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config');
const dbFile = path.resolve(config.DATABASE_FILE);

// ensure data directory exists
const fs = require('fs');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new sqlite3.Database(dbFile);
module.exports = db;
