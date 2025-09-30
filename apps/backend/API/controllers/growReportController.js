const {
  getGrowthTimeline,
  exportCycleDataCSV,
  getAggregateYieldStats,
} = require("../services/growReportService");

exports.timeline = async (req, res) => {
  try {
    const data = await getGrowthTimeline(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.downloadCSV = async (req, res) => {
  try {
    const csv = await exportCycleDataCSV(req.user.id, req.params.id);
    res.header("Content-Type", "text/csv");
    res.attachment(`cycle_${req.params.id}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.summary = async (req, res) => {
  try {
    const stats = await getAggregateYieldStats(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
