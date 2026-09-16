const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Pokhara Local backend!');
});

app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});