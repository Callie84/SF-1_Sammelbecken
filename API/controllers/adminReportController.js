const { getPlanStats, getUserStats, getGrowUsage } = require('../services/adminReportService');

exports.planStats = async (req, res) => {
  res.json(await getPlanStats());
};

exports.userStats = async (req, res) => {
  res.json(await getUserStats());
};

exports.usageStats = async (req, res) => {
  res.json(await getGrowUsage());
};