const { scrapePrices } = require('../services/priceScraperService');

// POST /scraper/run
exports.runScraper = async (req, res) => {
  try {
    await scrapePrices();
    res.json({ message: 'Preis-Scraping erfolgreich abgeschlossen' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};