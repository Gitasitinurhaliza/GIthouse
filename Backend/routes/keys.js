// routes/keys.js
const express = require('express');
const router = express.Router();
const Key = require('../models/Key');

// GET semua kunci
router.get('/', async (req, res) => {
  try {
    const keys = await Key.findOne();
    res.json({
      libra: keys?.libra || '26sep2002',   // ← default baru
      virgo: keys?.virgo || '27agus2002'    // ← default baru
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update kunci Libra
router.put('/libra', async (req, res) => {
  const { key } = req.body;
  try {
    let dbKey = await Key.findOne();
    if (!dbKey) {
      dbKey = new Key({ libra: key, virgo: '27agus2002' });
    } else {
      dbKey.libra = key;
    }
    await dbKey.save();
    res.json({ libra: key });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update kunci Virgo
router.put('/virgo', async (req, res) => {
  const { key } = req.body;
  try {
    let dbKey = await Key.findOne();
    if (!dbKey) {
      dbKey = new Key({ libra: '26sep2002', virgo: key });
    } else {
      dbKey.virgo = key;
    }
    await dbKey.save();
    res.json({ virgo: key });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;