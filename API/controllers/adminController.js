const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const Seedbank = require("../models/Seedbank");
const PriceAlert = require("../models/PriceAlert");

exports.listUsers = async (req, res) => {
  const users = await User.find().select("username email role createdAt");
  res.json(users);
};

exports.listLogs = async (req, res) => {
  const logs = await AdminLog.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
};

exports.listSeedbanks = async (req, res) => {
  const banks = await Seedbank.find().select("name url rating updatedAt");
  res.json(banks);
};

exports.listAlerts = async (req, res) => {
  const alerts = await PriceAlert.find().select("userId strain seedbank targetPrice notified createdAt");
  res.json(alerts);
};