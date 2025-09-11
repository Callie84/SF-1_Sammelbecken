const Subscription = require('../models/Subscription');
const User = require('../models/User');
const GrowCycle = require('../models/GrowCycle');
const XLSX = require('xlsx');

// Zeitreihe: neue Registrierungen pro Tag im Zeitraum
async function getDailyRegistrations(startDate, endDate) {
  const pipeline = [
    { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } }
  ];
  const results = await User.aggregate(pipeline);
  return results.map(r => ({ date: r._id, count: r.count }));
}

// Excel-Export: Plan-Statistiken
async function exportPlanStatsExcel(outputPath) {
  const plans = await Subscription.aggregate([
    { $group: { _id: "$plan", count: { $sum: 1 } } }
  ]);
  const data = plans.map(p => ({ plan: p._id, count: p.count }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PlanStats');
  XLSX.writeFile(wb, outputPath);
  return outputPath;
}

module.exports = { getDailyRegistrations, exportPlanStatsExcel };