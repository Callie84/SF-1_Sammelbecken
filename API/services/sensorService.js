const SensorReading = require("../models/SensorReading");

// Neue Lesung speichern
async function addReading({ sensorId, type, value, timestamp }) {
  const reading = new SensorReading({ sensorId, type, value, timestamp });
  await reading.save();
  return reading;
}

// Letzte N Lesungen pro Sensor/Typ
async function getLatestReadings(sensorId, type, limit = 50) {
  return SensorReading.find({ sensorId, type })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}

module.exports = { addReading, getLatestReadings };
