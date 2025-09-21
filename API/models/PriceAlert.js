const mongoose = require("mongoose");

const PriceAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  strain: String,
  seedbank: String,
  targetPrice: Number,
  currency: { type: String, default: "EUR" },
  createdAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false },
});

module.exports = mongoose.model("PriceAlert", PriceAlertSchema);
