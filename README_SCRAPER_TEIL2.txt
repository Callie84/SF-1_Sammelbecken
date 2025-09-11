🛠 Modul 19 – Teil 2: Scraper-Service & Scheduler
- **Service**:
  • scrapePrices(): Cluster-basiertes Scraping mit Puppeteer-Cluster
  • Liest Seed-Einträge, navigiert zu Seiten, extrahiert Preis, upsertet PriceEntry
- **Controller & Route**:
  • POST /scraper/run (Admin): manuelles Auslösen des Scrapers
  • Routen: `/scraper/run` unter `/api`
- **Cronjob**: cron/scrapeCron.js (täglich 03:30 Uhr) startet scrapePrices()
- **Model Dependencies**: Seed, PriceEntry
- **Voraussetzungen**: Puppeteer-Cluster installiert, Shop-spezifische Selektoren anpassen