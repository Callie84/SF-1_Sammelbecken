📈 GrowManager PRO II – Teil 2:
- Service:
  • getStageDistribution(userId, cycleId): [{ stage, count }]
  • exportAllCyclesExcel(userId, outputPath): Excel-Datei mit Cycle-Übersicht
- Controller:
  • GET /report/growcycles/:id/stages → Chart-Daten für Stage-Verteilung
  • GET /report/growcycles/export/excel → Download cycles_summary.xlsx
- Abhängigkeiten: xlsx-Package
- Export-Pfad: /exports/cycles_summary.xlsx