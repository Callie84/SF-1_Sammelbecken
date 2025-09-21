const mongoose = require("mongoose");

const PriceEntrySchema = new mongoose.Schema({
  strain: { type: String, required: true },
  seedbank: String,
  price: Number,
  currency: String,
  url: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceEntry", PriceEntrySchema);
