const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription");

webpush.setVapidDetails(
  process.env.WEBPUSH_SUBJECT,
  process.env.WEBPUSH_PUBLIC_KEY,
  process.env.WEBPUSH_PRIVATE_KEY,
);

async function sendWebPush(userId, payload) {
  const subscriptions = await PushSubscription.find({ userId });
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
    } catch (err) {
      console.error("WebPush fehlgeschlagen für", sub.endpoint, err);
    }
  }
}

module.exports = { sendWebPush };
