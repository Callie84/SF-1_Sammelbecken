const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true, unique: true },
  type: { type: String, enum: ['verify', 'reset'], required: true },
  expires: { type: Date, required: true }
});

module.exports = mongoose.model('Token', TokenSchema);