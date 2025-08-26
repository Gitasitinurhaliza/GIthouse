// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const chaptersRoute = require('./routes/chapters');
const keysRoute = require('./routes/keys');

app.use('/api/chapters', chaptersRoute);
app.use('/api/keys', keysRoute);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Terhubung ke MongoDB Atlas'))
  .catch(err => console.error('❌ Gagal koneksi MongoDB:', err));

// Route utama
app.get('/', (req, res) => {
  res.send('<h1>🌐 Githouse Backend Aktif</h1>');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});