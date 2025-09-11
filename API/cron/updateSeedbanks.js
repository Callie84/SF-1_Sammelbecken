const cron = require('node-cron');
const { updateSeedbanksDaily } = require('../services/seedbankUpdateService');

// Täglich um 02:00 Uhr
cron.schedule('0 2 * * *', () => {
  console.log('🕑 Starte Seedbank-Update...');
  updateSeedbanksDaily().catch(console.error);
});