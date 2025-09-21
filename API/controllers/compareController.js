const {
  compareScenarios,
  exportScenariosCSV,
} = require("../services/compareService");

exports.compare = async (req, res) => {
  const { scenarios } = req.body;
  const results = await compareScenarios(scenarios);
  res.json(results);
};

exports.exportCSV = async (req, res) => {
  const { scenarios } = req.body;
  const csv = await exportScenariosCSV(scenarios);
  res.header("Content-Type", "text/csv");
  res.attachment("scenarios.csv");
  res.send(csv);
};
