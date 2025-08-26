// routes/chapters.js
const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const mongoose = require('mongoose'); // ← Tambahkan ini untuk validasi ObjectId

// GET semua chapter
router.get('/', async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ createdAt: 1 }); // Urutkan dari terlama ke terbaru
    const grouped = chapters.reduce((acc, ch) => {
      acc[ch.section] = acc[ch.section] || [];
      acc[ch.section].push(ch); // Gunakan push agar urutan sesuai createdAt
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    console.error('Gagal ambil chapter:', err);
    res.status(500).json({ message: 'Gagal ambil data dari server' });
  }
});

// POST tambah chapter
router.post('/', async (req, res) => {
  const { section, title, content } = req.body;

  if (!['libra', 'virgo', 'karyaku'].includes(section)) {
    return res.status(400).json({ message: 'Section tidak valid' });
  }

  const chapter = new Chapter({
    section,
    title,
    content,
    createdAt: Date.now() // Pastikan createdAt terisi
  });

  try {
    const saved = await chapter.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Gagal simpan chapter:', err);
    res.status(400).json({ message: 'Gagal menyimpan chapter' });
  }
});

// DELETE /api/chapters/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validasi ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const chapter = await Chapter.findByIdAndDelete(id);

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter tidak ditemukan' });
    }

    res.json({ message: 'Chapter berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus chapter:', err);
    res.status(500).json({ message: 'Gagal menghapus chapter' });
  }
});

module.exports = router;