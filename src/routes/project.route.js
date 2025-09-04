// Project related routes
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const auth = require('../middleware/auth.middleware');

// list projects (any authenticated user)
router.get('/', auth(), (req, res) => {
  db.all('SELECT * FROM projects ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// create project (unhabitat/admin)
router.post('/', auth(['unhabitat','admin']), (req, res) => {
  const { title, status } = req.body;
  db.run('INSERT INTO projects (title,status) VALUES (?,?)', [title, status||'Not Started'], function(err){
    if(err) return res.status(400).json({ error: 'Create failed' });
    db.get('SELECT * FROM projects WHERE id = ?', [this.lastID], (e,row) => res.json(row));
  });
});

// add expenditure (unhabitat/admin)
router.post('/:projectId/expenditures', auth(['unhabitat','admin']), (req, res) => {
  const { projectId } = req.params;
  const { amount, description } = req.body;
  db.run('INSERT INTO expenditures (project_id,amount,description,recorded_by) VALUES (?,?,?,?)', [projectId, amount, description, req.user.id], function(err){
    if(err) return res.status(400).json({ error: 'Insert failed' });
    db.get('SELECT * FROM expenditures WHERE id = ?', [this.lastID], (e,row) => res.json(row));
  });
});

// get expenditures (all authenticated users)
router.get('/:projectId/expenditures', auth(), (req, res) => {
  const { projectId } = req.params;
  db.all('SELECT e.*, u.name as recorded_by_name FROM expenditures e LEFT JOIN users u ON u.id = e.recorded_by WHERE project_id = ? ORDER BY created_at DESC', [projectId], (err, rows) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// update project status (unhabitat/admin)
router.patch('/:projectId/status', auth(['unhabitat','admin']), (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;
  db.run('UPDATE projects SET status = ? WHERE id = ?', [status, projectId], function(err){
    if(err) return res.status(400).json({ error: 'Update failed' });
    db.get('SELECT * FROM projects WHERE id = ?', [projectId], (e,row) => res.json(row));
  });
});

module.exports = router;
