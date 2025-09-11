const { calculatePowerCost, estimateYield } = require('./calcService');
const { Parser } = require('json2csv');

// Erstellt Kosten-Prognose über Tage und ermittelt Ertragsschätzung
function forecastScenario({ name, watt, hoursPerDay, pricePerKwh, areaSqm, gramsPerSqm, days }) {
  const daily = [];
  for (let d = 1; d <= days; d++) {
    const { costPerDay } = calculatePowerCost(watt, hoursPerDay, pricePerKwh);
    daily.push({ day: d, cost: Number(costPerDay.toFixed(2)) });
  }
  const yieldRes = estimateYield(areaSqm, gramsPerSqm);
  return { name, daily, yieldTotal: yieldRes.yieldTotal };
}

// CSV-Export der Prognose
function exportForecastCSV(scenarios) {
  // scenarios: array with forecastScenario outputs
  const rows = scenarios.flatMap(s => s.daily.map(d => ({
    name: s.name,
    day: d.day,
    cost: d.cost,
    yieldTotal: s.yieldTotal
  })));
  const fields = ['name', 'day', 'cost', 'yieldTotal'];
  const parser = new Parser({ fields });
  return parser.parse(rows);
}

module.exports = { forecastScenario, exportForecastCSV };