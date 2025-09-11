const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  strain: String,
  note: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);