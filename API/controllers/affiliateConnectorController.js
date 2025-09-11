const { fetchSeedExpressOffers, fetchGreenShopOffers } = require('../services/affiliateConnectorService');

// GET /affiliate/connect/seedexpress/:strain
exports.seedExpress = async (req, res) => {
  try {
    const offers = await fetchSeedExpressOffers(req.params.strain);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /affiliate/connect/greenshop/:strain
exports.greenShop = async (req, res) => {
  try {
    const offers = await fetchGreenShopOffers(req.params.strain);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};