const mongoose = require("mongoose");

const FavoriteItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  strain: { type: String, required: true },
  note: String,
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model("FavoriteItem", FavoriteItemSchema);
