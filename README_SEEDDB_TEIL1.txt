🌱 Seed-Datenbank & Preis-Modul – Teil 1:
- **Modell**: Seed (strain, genetics, breeder, thc, cbd, floweringTime, indoorYield, images[], priceOffers[])
- **Service**:
  • importSeeds(): Liest data/seed_data.csv, parsed CSV, upsertet Seeds
- **Controller & Route**:
  • POST /seeds/import → manuelle Auslösung (Admin)
- **Cronjob**: cron/seedDbCron.js (täglich 02:00 Uhr)
- **CSV-Format**: strain,genetics,breeder,thc,cbd,floweringTime,indoorYield,images (| getrennt)
- Dateipfad: API/data/seed_data.csv