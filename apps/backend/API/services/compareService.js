const { calculatePowerCost, estimateYield } = require("./calcService");
const { Parser } = require("json2csv");

async function compareScenarios(scenarios) {
  // scenarios: [{ name, watt, hoursPerDay, pricePerKwh, areaSqm, gramsPerSqm }]
  return scenarios.map((s) => {
    const power = calculatePowerCost(s.watt, s.hoursPerDay, s.pricePerKwh);
    const yieldRes = estimateYield(s.areaSqm, s.gramsPerSqm);
    return { ...s, ...power, ...yieldRes };
  });
}

async function exportScenariosCSV(scenarios) {
  const results = await compareScenarios(scenarios);
  const fields = [
    "name",
    "watt",
    "hoursPerDay",
    "pricePerKwh",
    "kwhPerDay",
    "costPerDay",
    "areaSqm",
    "gramsPerSqm",
    "yieldTotal",
  ];
  const parser = new Parser({ fields });
  return parser.parse(results);
}

module.exports = { compareScenarios, exportScenariosCSV };
