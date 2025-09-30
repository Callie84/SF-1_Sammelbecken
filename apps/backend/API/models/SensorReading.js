const mongoose = require("mongoose");

const SensorReadingSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  type: {
    type: String,
    enum: ["temperature", "humidity", "co2"],
    required: true,
  },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SensorReading", SensorReadingSchema);
