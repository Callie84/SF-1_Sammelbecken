const { forecastScenario, exportForecastCSV } = require('../services/forecastService');

// POST /calc/forecast { scenarios: [...], days }
exports.forecast = (req, res) => {
  const { scenarios, days } = req.body;
  const results = scenarios.map(s => forecastScenario({ ...s, days }));
  res.json(results);
};

// POST /calc/forecast/export { scenarios: [...], days }
exports.exportForecast = (req, res) => {
  const { scenarios, days } = req.body;
  const forecasts = scenarios.map(s => forecastScenario({ ...s, days }));
  const csv = exportForecastCSV(forecasts);
  res.header('Content-Type', 'text/csv');
  res.attachment('forecast.csv');
  res.send(csv);
};