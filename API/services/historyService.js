const SensorReading = require('../models/SensorReading');
const PriceEntry = require('../models/PriceEntry');

// Historische Stromkosten für Zeitraum
async function getPowerHistory(sensorId, start, end) {
  // Dummy: liest historische readings, berechnet Kosten
  const readings = await SensorReading.find({ sensorId, type: 'power', timestamp: { $gte: start, $lte: end }}).lean();
  return readings.map(r => ({ date: r.timestamp, cost: (r.value/1000)*0.3 }));
}

// Historische Erträge
async function getYieldHistory(cycleId) {
  const entries = await PriceEntry.find({ cycleId }).lean();
  return entries.map(e => ({ date: e.timestamp, yield: e.grams }));
}

module.exports = { getPowerHistory, getYieldHistory };