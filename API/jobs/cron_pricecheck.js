const cron = require("node-cron");
const { checkPriceAlerts } = require("../services/priceChecker");

// Alle 30 Minuten ausführen
cron.schedule("*/30 * * * *", () => {
  console.log("⏰ Preisalarm-Check läuft...");
  checkPriceAlerts();
});