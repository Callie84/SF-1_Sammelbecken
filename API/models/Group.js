const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  wishlistIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', GroupSchema);