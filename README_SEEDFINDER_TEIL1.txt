🌿 SeedFinder Core – Teil 1: Search API
- Service: searchSeeds(params) mit Suche und Preislookup
- Controller: GET /api/seeds/search?q=&seedbank=&minPrice=&maxPrice=&sortBy=&order=&limit=&page=
- Antwort: Array von Seed-Dokumenten mit Feld 'lowestPrice'
- Abhängigkeiten: Modelle 'Seed' und 'PriceEntry'