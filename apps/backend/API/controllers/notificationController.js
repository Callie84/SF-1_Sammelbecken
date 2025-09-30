const { sendEmail } = require("../services/emailService");
const { sendWebPush } = require("../services/webpushService");
const PushSubscription = require("../models/PushSubscription");
const auth = require("../middleware/authMiddleware");

// WebPush Subscription speichern
async function subscribePush(req, res) {
  const { endpoint, keys } = req.body;
  const existing = await PushSubscription.findOne({ endpoint });
  if (!existing) {
    const sub = new PushSubscription({ userId: req.user.id, endpoint, keys });
    await sub.save();
  }
  res.json({ message: "Subscription gespeichert" });
}

// Subscription löschen
async function unsubscribePush(req, res) {
  const { endpoint } = req.body;
  await PushSubscription.deleteOne({ endpoint, userId: req.user.id });
  res.json({ message: "Subscription entfernt" });
}

// Alert manuell auslösen (Test)
async function triggerAlerts(req, res) {
  const { userId, title, message } = req.body;
  await sendEmail(req.body.email, title, message, `<p>${message}</p>`);
  await sendWebPush(userId, { title, message });
  res.json({ message: "Alerts ausgelöst" });
}

module.exports = { subscribePush, unsubscribePush, triggerAlerts };
