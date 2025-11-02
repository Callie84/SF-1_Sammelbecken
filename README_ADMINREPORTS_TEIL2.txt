📊 Admin Reports – Teil 2:
- **Chart-Daten**:
  • GET /admin/reports/registrations?start=<ISO>&end=<ISO>  
    → [{ date, count }] tägliche Neuregistrierungen  
- **Excel-Export**:
  • GET /admin/reports/export/plans → Download plan_stats.xlsx  
- **Services**:
  • getDailyRegistrations(startDate, endDate)  
  • exportPlanStatsExcel(outputPath)  
- **Dependencies**: xlsx  
- **Routes**: unter `/admin/reports` (Admin-only)