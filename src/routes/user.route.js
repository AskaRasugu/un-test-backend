// User utility routes (profile, list - admin)
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const auth = require('../middleware/auth.middleware');

router.get('/me', auth(), (req, res) => {
  res.json(req.user);
});

// list users (admin)
router.get('/', auth(['admin']), (req, res) => {
  db.all('SELECT id,name,email,role,created_at FROM users', [], (err, rows) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
