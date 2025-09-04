// Simple seeder to create an initial UN-Habitat user (password: Password123!)
const bcrypt = require('bcrypt');
const db = require('./db');

const seed = async () => {
  const hash = await bcrypt.hash('Password123!', 10);
  db.run("INSERT OR IGNORE INTO users (name,email,password,role) VALUES (?,?,?,?)", ['UN Habitat Finance','unhab.finance@example.com', hash, 'unhabitat'], function(err){
    if(err) console.error('Seed error', err);
    else console.log('Seed complete');
  });
};

seed();
