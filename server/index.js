require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Pokhara Local backend!');
});

app.get('/api/listings', async (req, res) => {
  const { search, category } = req.query;

  let query = 'SELECT * FROM listings WHERE 1=1';
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

app.post('/api/listings', async (req, res) => {
  const { title, category, description, location, price_range, phone } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO listings (title, category, description, location, price_range, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, category, description, location, price_range, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});
app.put('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, description, location, price_range, phone } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE listings
       SET title = $1, category = $2, description = $3, location = $4, price_range = $5, phone = $6
       WHERE id = $7
       RETURNING *`,
      [title, category, description, location, price_range, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted', listing: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});