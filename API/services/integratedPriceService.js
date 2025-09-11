const { fetchSeedExpressOffers, fetchGreenShopOffers } = require('./affiliateConnectorService');
const { scrapePrices } = require('./priceScraperService');
const PriceEntry = require('../models/PriceEntry');
const Seed = require('../models/Seed');

// Kombiniert Scraper- und API-Daten für Preisvergleich
async function updateAllPrices() {
  // 1. Scraping (bestehender Service)
  await scrapePrices();
  // 2. API-Connectoren
  const seeds = await Seed.find().lean();
  for (const seed of seeds) {
    const strain = seed.strain;
    try {
      const seOffers = await fetchSeedExpressOffers(strain);
      const gsOffers = await fetchGreenShopOffers(strain);
      const allOffers = [...seOffers, ...gsOffers];
      // Upsert PriceEntry für jedes Angebot
      for (const offer of allOffers) {
        await PriceEntry.updateOne(
          { strain, seedbank: offer.seedbank },
          {
            strain,
            seedbank: offer.seedbank,
            price: offer.priceEur,
            currency: 'EUR',
            url: offer.url,
            timestamp: offer.lastUpdated
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error(`Connector Error for ${strain}:`, err.message);
    }
  }
}

// Holt Preise direkt für Anzeige
async function getCombinedOffers(strain) {
  const entries = await PriceEntry.find({ strain }).sort({ price: 1 }).lean();
  return entries;
}

module.exports = { updateAllPrices, getCombinedOffers };