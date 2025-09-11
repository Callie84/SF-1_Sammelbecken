const PriceAlert = require('../models/PriceAlert');
const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { sendWebPush } = require('./webpushService');

// Prüft offene Alarme und sendet Notifications
async function processAlerts() {
  const alerts = await PriceAlert.find({ notified: false });
  for (const alert of alerts) {
    // Prüfe aktuellen Preis-Eintrag
    const PriceEntry = require('../models/PriceEntry');
    const match = await PriceEntry.findOne({
      strain: alert.strain,
      seedbank: alert.seedbank,
      price: { $lte: alert.targetPrice }
    });
    if (match) {
      // Markiere als benachrichtigt
      alert.notified = true;
      await alert.save();

      // Lade User-Daten
      const user = await User.findById(alert.userId);
      const subject = \`Preisalarm: \${alert.strain} bei \${alert.seedbank}\`;
      const text = \`Dein Preisalarm für \${alert.strain} wurde ausgelöst: aktueller Preis \${match.price} EUR.\`;
      // E-Mail senden
      await sendEmail(user.email, subject, text, `<p>\${text}</p>`);
      // WebPush senden
      await sendWebPush(user._id, { title: subject, message: text });
    }
  }
}

module.exports = { processAlerts };