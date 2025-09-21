const GrowCycle = require("../models/GrowCycle");

async function getOverallStats(userId) {
  const cycles = await GrowCycle.find({ userId }).lean();
  const totalCycles = cycles.length;
  const totalEntries = cycles.reduce((sum, c) => sum + c.entries.length, 0);
  const avgEntries = totalCycles ? (totalEntries / totalCycles).toFixed(2) : 0;
  const avgDuration = cycles.reduce((sum, c) => {
    if (c.startDate && c.entries.length) {
      const endDates = c.entries.map((e) => new Date(e.date));
      const maxDate = new Date(Math.max.apply(null, endDates));
      return sum + (maxDate - new Date(c.startDate)) / (1000 * 60 * 60 * 24);
    }
    return sum;
  }, 0);
  const avgDurationDays = totalCycles
    ? (avgDuration / totalCycles).toFixed(1)
    : 0;
  return {
    totalCycles,
    avgEntries: Number(avgEntries),
    avgDurationDays: Number(avgDurationDays),
  };
}

async function getCycleStats(userId, cycleId) {
  const cycle = await GrowCycle.findOne({ userId, _id: cycleId }).lean();
  if (!cycle) throw new Error("Zyklus nicht gefunden");
  const entryCount = cycle.entries.length;
  const stages = cycle.entries.reduce((acc, e) => {
    acc[e.stage] = (acc[e.stage] || 0) + 1;
    return acc;
  }, {});
  return { id: cycleId, entryCount, stages };
}

module.exports = { getOverallStats, getCycleStats };
