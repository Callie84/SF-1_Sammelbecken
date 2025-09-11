const { updateAllPrices, getCombinedOffers } = require('../services/integratedPriceService');

// POST /affiliate/update-all
exports.updateAll = async (req, res) => {
  try {
    await updateAllPrices();
    res.json({ message: 'Alle Preise aktualisiert (Scraping & APIs)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /affiliate/offers/:strain
exports.getOffers = async (req, res) => {
  try {
    const offers = await getCombinedOffers(req.params.strain);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};