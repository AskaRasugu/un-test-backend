# CIF Backend - Refactored

Structured Node.js + Express backend for the CIF assessment. Follows a modular pattern:
- src/server.js - app entry
- src/config - configuration
- src/models - db, migrations, seed
- src/routes - express routes grouped by resource
- src/middleware - auth middleware

Quick start:
```bash
npm install
npm run migrate
npm run seed
npm start
```
