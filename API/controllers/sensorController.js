const { addReading, getLatestReadings } = require('../services/sensorService');

// POST /monitor/readings
exports.postReading = async (req, res) => {
  const { sensorId, type, value, timestamp } = req.body;
  try {
    const reading = await addReading({ sensorId, type, value, timestamp });
    res.status(201).json(reading);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /monitor/readings?sensorId=&type=&limit=
exports.getReadings = async (req, res) => {
  const { sensorId, type, limit } = req.query;
  if (!sensorId || !type) {
    return res.status(400).json({ error: 'sensorId und type erforderlich' });
  }
  const readings = await getLatestReadings(sensorId, type, parseInt(limit) || 50);
  res.json(readings);
};