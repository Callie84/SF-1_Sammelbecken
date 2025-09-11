const { importSeeds } = require('../services/seedImportService');

// POST /seeds/import
exports.runImport = async (req, res) => {
  try {
    const msg = await importSeeds();
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};