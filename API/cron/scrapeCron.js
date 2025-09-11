const cron = require('node-cron');
const { scrapePrices } = require('../services/priceScraperService');

// Täglich um 03:30 Uhr: Preis-Scraping
cron.schedule('30 3 * * *', () => {
  console.log('🕞 Starte Preis-Scraping...');
  scrapePrices().then(() => console.log('✅ Preis-Scraping abgeschlossen')).catch(console.error);
});