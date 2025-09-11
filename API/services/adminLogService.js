const AdminLog = require("../models/AdminLog");

async function logAction(userId, action, details) {
  const entry = new AdminLog({ userId, action, details });
  await entry.save();
}

module.exports = { logAction };