const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  strain: { type: String, required: true },
  note: String,
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  items: [WishlistItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

WishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Wishlist', WishlistSchema);