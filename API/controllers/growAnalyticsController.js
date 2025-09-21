const {
  getOverallStats,
  getCycleStats,
} = require("../services/growAnalyticsService");

exports.overall = async (req, res) => {
  try {
    const stats = await getOverallStats(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cycle = async (req, res) => {
  try {
    const stats = await getCycleStats(req.user.id, req.params.id);
    res.json(stats);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
