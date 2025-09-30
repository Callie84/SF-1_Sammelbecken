const GrowCycle = require("../models/GrowCycle");
const { sendEmail } = require("../services/emailService");
const { sendWebPush } = require("../services/webpushService");

// Prüft alle GrowCycles auf fällige Reminders und sendet Alerts
async function processReminders() {
  const now = new Date();
  const cycles = await GrowCycle.find({ "reminders.sent": false });
  for (const cycle of cycles) {
    for (const rem of cycle.reminders) {
      if (!rem.sent && new Date(rem.date) <= now) {
        // sende E-Mail/WebPush an Nutzer
        const userId = cycle.userId;
        const subject = `Reminder: ${rem.message}`;
        const text = `${rem.message} für Grow "${cycle.title}"`;
        // placeholder: retrieve user email
        // send notification
        await sendEmail(cycle.userId, subject, text, `<p>${text}</p>`);
        await sendWebPush(cycle.userId, { title: subject, message: text });
        // mark as sent
        rem.sent = true;
      }
    }
    await cycle.save();
  }
}
module.exports = { processReminders };
