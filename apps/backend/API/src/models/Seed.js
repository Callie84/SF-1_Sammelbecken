const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
  strain: { type: String, required: true },
  seedbank: { type: String, required: true },
  price: { type: Number, required: true },
  genetics: String,
  thc: String,
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seed', seedSchema);
