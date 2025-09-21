const Subscription = require("../models/Subscription");
const { createCheckoutSession } = require("../services/paymentService");

// Subscription checkout starten
exports.startSubscription = async (req, res) => {
  const { plan } = req.body;
  const session = await createCheckoutSession(req.user.id, plan);
  res.json(session);
};

// Webhook endpoint
exports.webhook = async (req, res) => {
  const event = req.body;
  await require("../services/paymentService").handleWebhook(event);
  res.status(200).send("Received");
};

// Abo-Daten abrufen
exports.getSubscription = async (req, res) => {
  const sub = await Subscription.findOne({ userId: req.user.id });
  res.json(sub);
};
