const Seed = require('../models/Seed');

async function getFilterOptions() {
  const seedbanks = await Seed.distinct('seedbank');
  const genetics = await Seed.distinct('genetics');
  const floweringTimes = await Seed.distinct('flowering_time');
  const yields = await Seed.distinct('indoor_yield');
  return { seedbanks, genetics, floweringTimes, yields };
}

module.exports = { getFilterOptions };