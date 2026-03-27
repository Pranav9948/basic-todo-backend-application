const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;

    const newTodo = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title],
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/todos', async (req, res) => {
  try {
    const { search, completed } = req.query;

    let query = 'SELECT * FROM todos WHERE 1=1';
    const values = [];

    // 🔍 Search filter
    if (search) {
      values.push(`%${search}%`);
      query += ` AND title ILIKE $${values.length}`;
    }

    // ✅ Completed filter
    if (completed !== undefined) {
      values.push(completed === 'true');
      query += ` AND completed = $${values.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const todos = await pool.query(query, values);

    res.json(todos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  await pool.query('UPDATE todos SET title=$1, completed=$2 WHERE id=$3', [
    title,
    completed,
    id,
  ]);

  res.json('Updated');
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM todos WHERE id=$1', [id]);

  res.json('Deleted');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
