🌿 SeedFinder Core – Teil 2: Autocomplete & Filter-Optionen API
- Service:
  • getSuggestions(query, limit): Rückgabe Array von Strain-Namen, die mit query beginnen
  • getFilterOptions(): Rückgabe Objekt mit Arrays für seedbanks, genetics, floweringTimes, yields
- Controller:
  • GET /api/seeds/autocomplete?q=&limit= → Autocomplete-Vorschläge
  • GET /api/seeds/options → Filter-Optionen für UI
- Modelle benötigt: Seed (mit Feldern strain, seedbank, genetics, flowering_time, indoor_yield)