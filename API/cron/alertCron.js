const cron = require("node-cron");
const { processAlerts } = require("../services/alertService");

// Cronjob alle 30 Minuten
cron.schedule("*/30 * * * *", () => {
  console.log("⏰ Starte automatisierte Alertprüfung...");
  processAlerts()
    .then(() => {
      console.log("✅ Alertprüfung abgeschlossen");
    })
    .catch((err) => {
      console.error("⚠️ Fehler bei Alertprüfung:", err);
    });
});
