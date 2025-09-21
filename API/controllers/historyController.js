const {
  getPowerHistory,
  getYieldHistory,
} = require("../services/historyService");

exports.powerHistory = async (req, res) => {
  const { sensorId, start, end } = req.query;
  const data = await getPowerHistory(sensorId, new Date(start), new Date(end));
  res.json(data);
};

exports.yieldHistory = async (req, res) => {
  const { cycleId } = req.params;
  const data = await getYieldHistory(cycleId);
  res.json(data);
};
