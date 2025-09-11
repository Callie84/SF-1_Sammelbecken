const Seed = require("../models/Seed");

exports.applyFilters = async (req, res) => {
  try {
    const {
      seedbank, genetics, flowering_time, indoor_yield,
      minThc, maxThc, minCbd, maxCbd,
      sortBy, order, limit, page
    } = req.query;

    let query = {};
    if (seedbank) query.seedbank = seedbank;
    if (genetics) query.genetics = genetics;
    if (flowering_time) query.flowering_time = flowering_time;
    if (indoor_yield) query.indoor_yield = indoor_yield;

    if (minThc !== undefined || maxThc !== undefined) {
      query.thc = {};
      if (minThc !== undefined) query.thc.$gte = parseFloat(minThc);
      if (maxThc !== undefined) query.thc.$lte = parseFloat(maxThc);
    }

    if (minCbd !== undefined || maxCbd !== undefined) {
      query.cbd = {};
      if (minCbd !== undefined) query.cbd.$gte = parseFloat(minCbd);
      if (maxCbd !== undefined) query.cbd.$lte = parseFloat(maxCbd);
    }

    const options = {};
    // Sorting
    if (sortBy) {
      options.sort = { [sortBy]: order === "asc" ? 1 : -1 };
    }
    // Pagination
    const lim = parseInt(limit) || 100;
    const pg = parseInt(page) || 1;
    options.limit = lim;
    options.skip = (pg - 1) * lim;

    const seeds = await Seed.find(query, null, options);
    res.json(seeds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};