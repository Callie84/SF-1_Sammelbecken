const mongoose = require('mongoose');

const UploadedSeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  strain: { type: String, required: true },
  genetics: String,
  thc: Number,
  cbd: Number,
  description: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UploadedSeed', UploadedSeedSchema);