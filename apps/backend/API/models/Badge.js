const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  criteria: String, // e.g. 'first_message', 'top_contributor'
  createdAt: { type: Date, default: Date.now },
});

const UserBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
  awardedAt: { type: Date, default: Date.now },
});

module.exports = {
  Badge: mongoose.model("Badge", BadgeSchema),
  UserBadge: mongoose.model("UserBadge", UserBadgeSchema),
};
