const GrowCycle = require('../models/GrowCycle');
const { Parser } = require('json2csv');

async function getGrowthTimeline(userId, cycleId) {
  const cycle = await GrowCycle.findOne({ userId, _id: cycleId }).lean();
  if (!cycle) throw new Error('Zyklus nicht gefunden');
  // Zeitreihen-Daten: Datum vs Stage count
  return cycle.entries.map(e => ({ date: e.date, stage: e.stage }));
}

async function exportCycleDataCSV(userId, cycleId) {
  const timeline = await getGrowthTimeline(userId, cycleId);
  const parser = new Parser({ fields: ['date', 'stage'] });
  return parser.parse(timeline);
}

async function getAggregateYieldStats(userId) {
  const cycles = await GrowCycle.find({ userId }).lean();
  return cycles.map(c => ({
    title: c.title,
    totalEntries: c.entries.length,
    durationDays: c.entries.length
      ? Math.round((new Date(c.entries[c.entries.length-1].date) - new Date(c.startDate)) / (1000*60*60*24))
      : 0
  }));
}

module.exports = { getGrowthTimeline, exportCycleDataCSV, getAggregateYieldStats };