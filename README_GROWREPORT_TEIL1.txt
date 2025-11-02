📈 GrowManager PRO II – Teil 1:
- Service:
  • getGrowthTimeline(userId, cycleId): returns [{ date, stage }]
  • exportCycleDataCSV(userId, cycleId): returns CSV string
  • getAggregateYieldStats(userId): [{ title, totalEntries, durationDays }]
- Controller:
  • GET /report/growcycles/:id/timeline → JSON Timeline
  • GET /report/growcycles/:id/export → CSV Download
  • GET /report/growcycles/summary → JSON Summary of all cycles
- Route: routes/growReport.js (prefix /report)
- Auth erforderlich