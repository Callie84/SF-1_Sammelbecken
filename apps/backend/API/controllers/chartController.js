const path = require("path");
const {
  getStageDistribution,
  exportAllCyclesExcel,
} = require("../services/chartService");

exports.stageDistribution = async (req, res) => {
  try {
    const data = await getStageDistribution(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../../exports/cycles_summary.xlsx");
    await exportAllCyclesExcel(req.user.id, filePath);
    res.download(filePath, "cycles_summary.xlsx");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
