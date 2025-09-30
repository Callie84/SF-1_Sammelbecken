const mongoose = require("mongoose");

const PushSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PushSubscription", PushSubscriptionSchema);
