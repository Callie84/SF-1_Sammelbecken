const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  country: String,
  paymentMethods: [String],
  affiliateId: String,
  rating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Shop", ShopSchema);