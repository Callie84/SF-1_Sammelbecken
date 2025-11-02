🔍 Filter-Builder – Teil 2:
- GET /filters/apply → Wendet Filter auf Sorten an
- Query-Parameter:
  • seedbank, genetics, flowering_time, indoor_yield
  • minThc, maxThc, minCbd, maxCbd
  • sortBy (z.B. thc, cbd, indoor_yield), order (asc, desc)
  • limit (Anzahl), page (Seitenzahl)
- Antwort: JSON-Liste der Seed-Dokumente, die den Kriterien entsprechen