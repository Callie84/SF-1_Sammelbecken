const mongoose = require('mongoose');

const AffiliateClickSchema = new mongoose.Schema({
  affiliateLinkId: { type: mongoose.Schema.Types.ObjectId, ref: "AffiliateLink" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String
});

module.exports = mongoose.model("AffiliateClick", AffiliateClickSchema);