const { getChannelStats, getMessageStats, getEventStats } = require('../services/adminAnalyticsService');

exports.channelStats = async (req, res) => {
  const stats = await getChannelStats();
  res.json(stats);
};

exports.messageStats = async (req, res) => {
  const stats = await getMessageStats();
  res.json(stats);
};

exports.eventStats = async (req, res) => {
  const stats = await getEventStats();
  res.json(stats);
};