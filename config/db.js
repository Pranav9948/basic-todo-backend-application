const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '2026',
  host: 'localhost',
  port: 5432,
  database: 'todo_app',
});

module.exports = pool;
