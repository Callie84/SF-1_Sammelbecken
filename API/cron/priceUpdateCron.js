const cron = require("node-cron");
const { updateSeedPrices } = require("../services/priceUpdateService");

// Stunde gestartet, Cronjob jede Stunde um Minute 15
cron.schedule("15 * * * *", () => {
  console.log("🔄 Starte Seed-Preis-Update...");
  updateSeedPrices()
    .then(() => console.log("✅ Seed-Preis-Update abgeschlossen"))
    .catch(console.error);
});
