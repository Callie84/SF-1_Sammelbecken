const mongoose = require("mongoose");

const StatistikSchema = new mongoose.Schema({
  strain: String,
  views: { type: Number, default: 0 },
  searches: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Statistik", StatistikSchema);
