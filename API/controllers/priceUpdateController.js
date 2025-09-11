const { updateSeedPrices } = require('../services/priceUpdateService');

// POST /seeds/update-prices
exports.runPriceUpdate = async (req, res) => {
  try {
    await updateSeedPrices();
    res.json({ message: 'Seed-Daten mit aktuellen Preisen aktualisiert' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};