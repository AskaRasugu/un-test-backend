// Simple config module
require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_KEY || 'change_this_secret',
  DATABASE_FILE: process.env.DB_FILE || './data/cif.sqlite'
};
