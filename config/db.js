const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '2026',
  host: '127.0.0.1',
  port: 5432,
  database: 'todo_app',
});

module.exports = pool;
