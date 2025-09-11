const mongoose = require('mongoose');

const ThresholdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sensorId: String,
  type: { type: String, enum: ['temperature','humidity','co2'] },
  condition: { type: String, enum: ['above','below'] },
  value: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Threshold', ThresholdSchema);