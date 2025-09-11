const path = require('path');
const { getDailyRegistrations, exportPlanStatsExcel } = require('../services/reportChartService');

// GET /admin/reports/registrations?start=&end=
exports.dailyRegistrations = async (req, res) => {
  const { start, end } = req.query;
  const data = await getDailyRegistrations(start, end);
  res.json(data);
};

// GET /admin/reports/export/plans
exports.exportPlansExcel = async (req, res) => {
  const filePath = path.join(__dirname, '../../exports/plan_stats.xlsx');
  await exportPlanStatsExcel(filePath);
  res.download(filePath, 'plan_stats.xlsx');
};