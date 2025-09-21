const Seed = require("../models/Seed");

async function getSuggestions(query, limit = 10) {
  if (!query) return [];
  const regex = new RegExp("^" + query, "i");
  const results = await Seed.find({ strain: regex })
    .limit(limit)
    .select("strain -_id");
  return results.map((r) => r.strain);
}

module.exports = { getSuggestions };
