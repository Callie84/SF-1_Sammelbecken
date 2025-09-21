const PriceAlert = require("../models/PriceAlert");
const PriceEntry = require("../models/PriceEntry"); // wird durch Scraper befüllt
const User = require("../models/User");
const UserExt = require("../models/UserExtension");

async function checkPriceAlerts() {
  const alerts = await PriceAlert.find({ notified: false });

  for (const alert of alerts) {
    const match = await PriceEntry.findOne({
      strain: alert.strain,
      seedbank: alert.seedbank,
      price: { $lte: alert.targetPrice },
      currency: alert.currency,
    });

    if (match) {
      alert.notified = true;
      await alert.save();

      // TODO: hier könnte später eine echte Benachrichtigung rein
      console.log(
        `ALARM für ${alert.strain} bei ${alert.seedbank}: ${match.price} EUR`,
      );
    }
  }
}

module.exports = { checkPriceAlerts };
