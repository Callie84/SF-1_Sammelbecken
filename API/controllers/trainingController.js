const { trainModel } = require('../services/trainingService');

// POST /diagnose/train
exports.train = async (req, res) => {
  try {
    const result = await trainModel();
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};