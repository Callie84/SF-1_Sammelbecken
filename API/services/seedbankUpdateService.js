const { importSeedbanks } = require('./seedbankService');
// Hier könnten API-Calls oder Scraper integriert werden
async function updateSeedbanksDaily() {
  // Beispiel: aktuelle JSON neu importieren
  await importSeedbanks();
  console.log('Seedbanks wurden täglich aktualisiert');
}
module.exports = { updateSeedbanksDaily };