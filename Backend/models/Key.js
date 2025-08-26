// models/Key.js
const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  libra: { type: String, required: true },
  virgo: { type: String, required: true }
});

module.exports = mongoose.model('Key', keySchema);