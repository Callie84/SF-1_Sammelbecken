const GrowCycle = require('../models/GrowCycle');
const XLSX = require('xlsx');

async function getStageDistribution(userId, cycleId) {
  const cycle = await GrowCycle.findOne({ userId, _id: cycleId }).lean();
  if (!cycle) throw new Error('Zyklus nicht gefunden');
  const dist = cycle.entries.reduce((acc, e) => {
    acc[e.stage] = (acc[e.stage] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(dist).map(([stage, count]) => ({ stage, count }));
}

async function exportAllCyclesExcel(userId, outputPath) {
  const cycles = await GrowCycle.find({ userId }).lean();
  const data = cycles.map(c => ({
    title: c.title,
    startDate: c.startDate.toISOString().split('T')[0],
    entries: c.entries.length
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cycles');
  XLSX.writeFile(wb, outputPath);
  return outputPath;
}

module.exports = { getStageDistribution, exportAllCyclesExcel };