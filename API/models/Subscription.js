const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: ['free','premium'], default: 'free' },
  status: { type: String, enum: ['active','cancelled'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  paymentProvider: String,
  providerSubscriptionId: String
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);