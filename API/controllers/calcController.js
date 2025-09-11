const { calculatePowerCost, estimateYield } = require('../services/calcService');

// POST /calc/power
exports.powerCost = (req, res) => {
  const { watt, hoursPerDay, pricePerKwh } = req.body;
  const result = calculatePowerCost(watt, hoursPerDay, pricePerKwh);
  res.json(result);
};

// POST /calc/yield
exports.yieldEstimate = (req, res) => {
  const { areaSqm, gramsPerSqm } = req.body;
  const result = estimateYield(areaSqm, gramsPerSqm);
  res.json(result);
};