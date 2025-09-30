const User = require("../models/User");
const Seedbank = require("../models/Seedbank");
const PriceAlert = require("../models/PriceAlert");
const { logAction } = require("../services/adminLogService");

// Nutzerrolle ändern
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return res.status(404).json({ error: "Nutzer nicht gefunden" });
  await logAction(req.user.id, "UPDATE_USER_ROLE", {
    targetUser: id,
    newRole: role,
  });
  res.json(user);
};

// Nutzer löschen
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  await logAction(req.user.id, "DELETE_USER", { targetUser: id });
  res.json({ message: "Nutzer gelöscht" });
};

// Seedbank-Neuscrape auslösen
exports.triggerRescrape = async (req, res) => {
  // Placeholder: Integration mit Scraper-Service
  await logAction(req.user.id, "TRIGGER_SCRAPE", {});
  res.json({ message: "Rescrape ausgelöst" });
};

// Alle Logs löschen
exports.clearLogs = async (req, res) => {
  await AdminLog.deleteMany({});
  await logAction(req.user.id, "CLEAR_LOGS", {});
  res.json({ message: "Logs gelöscht" });
};
