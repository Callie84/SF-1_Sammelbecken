const mongoose = require("mongoose");

const IntegrationSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: String, required: true }, // 'sms', 'external_api'
  config: mongoose.Schema.Types.Mixed, // z.B. API keys, phone numbers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "IntegrationSettings",
  IntegrationSettingsSchema,
);
