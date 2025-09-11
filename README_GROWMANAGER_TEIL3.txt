📊 GrowManager PRO – Teil 3 (neu):
- Service: growAnalyticsService.js
  • getOverallStats(userId): { totalCycles, avgEntries, avgDurationDays }
  • getCycleStats(userId, cycleId): { id, entryCount, stages }
- Controller: growAnalyticsController.js
  • GET /growcycles/analytics  → Overall-Statistiken
  • GET /growcycles/:id/analytics → Zyklus-spezifische Stats
- Route: routes/growAnalytics.js
- Auth erforderlich