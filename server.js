require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found' }));

// Frontend (static HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_mern';

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env (copy .env.example to .env)');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
