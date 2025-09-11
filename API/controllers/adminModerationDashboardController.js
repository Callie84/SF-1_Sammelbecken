const adminLogService = require('../services/adminLogService');

// Moderations-Logs filtern und auflisten
exports.getModerationLogs = async (req, res) => {
  const { actionType, since } = req.query; // optional
  const logs = await adminLogService.listLogs({ actionType, since });
  res.json(logs);
};