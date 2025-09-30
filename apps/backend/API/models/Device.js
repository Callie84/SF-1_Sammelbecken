const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deviceId: { type: String, required: true },
  deviceName: String,
  lastSync: Date,
});

module.exports = mongoose.model("Device", DeviceSchema);
