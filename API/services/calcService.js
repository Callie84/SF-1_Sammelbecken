// Berechnet Stromkosten und Ertragsschätzung
function calculatePowerCost(watt, hoursPerDay, pricePerKwh) {
  const kwhPerDay = (watt / 1000) * hoursPerDay;
  const costPerDay = kwhPerDay * pricePerKwh;
  return { kwhPerDay, costPerDay };
}

function estimateYield(areaSqm, gramsPerSqm) {
  const yieldTotal = areaSqm * gramsPerSqm;
  return { areaSqm, gramsPerSqm, yieldTotal };
}

module.exports = { calculatePowerCost, estimateYield };
