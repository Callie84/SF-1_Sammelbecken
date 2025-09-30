const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');

// Mock Scraper - spÃ¤ter echte Scraper einbauen
router.post('/run', async (req, res) => {
  try {
    const mockData = [
      { strain: "Banana Kush", seedbank: "Zamnesia", price: 29.95, genetics: "Indica", thc: "22%" },
      { strain: "Northern Lights", seedbank: "Royal Queen Seeds", price: 24.50, genetics: "Indica", thc: "18%" },
      { strain: "Blue Dream", seedbank: "Dutch Passion", price: 32.00, genetics: "Hybrid", thc: "20%" }
    ];

    for (const data of mockData) {
      await Seed.findOneAndUpdate(
        { strain: data.strain, seedbank: data.seedbank },
        { ...data, last_updated: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, imported: mockData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', (req, res) => {
  res.json({ status: "ready", scrapers: ["zamnesia", "royal-queen-seeds", "dutch-passion"] });
});

module.exports = router;