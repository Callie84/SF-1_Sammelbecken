const cron = require('node-cron');
const { importSeeds } = require('../services/seedImportService');

// Täglich um 02:00 Uhr importieren
cron.schedule('0 2 * * *', () => {
  console.log('🔄 Starte Seed-DB-Import...');
  importSeeds()
    .then(msg => console.log('✅ ' + msg))
    .catch(console.error);
});