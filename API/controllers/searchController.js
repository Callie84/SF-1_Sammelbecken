const { searchSeeds } = require('../services/searchService');

exports.search = async (req, res) => {
  try {
    const results = await searchSeeds({
      query: req.query.q,
      seedbank: req.query.seedbank,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sortBy: req.query.sortBy,
      order: req.query.order,
      limit: req.query.limit,
      page: req.query.page
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};