// Authentication & role-based authorization middleware
const jwt = require('jsonwebtoken');
const config = require('../config');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing token' });
    const token = header.split(' ')[1];
    try {
      const payload = jwt.verify(token, config.JWT_SECRET);
      req.user = payload;
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = auth;
