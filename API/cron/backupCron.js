const cron = require("node-cron");
const {
  exportJSONToFile,
  exportCollectionCSV,
} = require("../services/exportService");
const path = require("path");

// Tägliches Backup um Mitternacht
cron.schedule("0 0 * * *", async () => {
  console.log("🚀 Starte automatisches Datenbank-Backup...");
  const jsonPath = path.join(__dirname, "../../exports/data.json");
  await exportJSONToFile(jsonPath);
  const collections = [
    "users",
    "growlogs",
    "alerts",
    "stats",
    "bookmarks",
    "uploads",
    "seedbanks",
  ];
  for (const col of collections) {
    const csvPath = path.join(__dirname, `../../exports/${col}.csv`);
    await exportCollectionCSV(
      require(`../models/${col[0].toUpperCase() + col.slice(1)}`),
      [],
      csvPath,
    );
  }
  console.log("✅ Backup abgeschlossen");
});
