const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  targetUrl: String,
  position: String,
  active: { type: Boolean, default: true },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AdSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Ad", AdSchema);
