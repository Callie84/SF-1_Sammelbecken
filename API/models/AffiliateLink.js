const mongoose = require("mongoose");

const AffiliateLinkSchema = new mongoose.Schema({
  seedbank: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  affiliateId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AffiliateLinkSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("AffiliateLink", AffiliateLinkSchema);
