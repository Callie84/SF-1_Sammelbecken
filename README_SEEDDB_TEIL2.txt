🌱 Seed-Datenbank & Preis-Modul – Teil 2:
- Modell: PriceEntry (strain, seedbank, price, currency, url, timestamp)
- Service: updateSeedPrices() aggregiert neueste PriceEntry pro Strain+Seedbank, updatet Seed.priceOffers
- Controller & Route: POST /seeds/update-prices (Admin)
- Cronjob: cron/priceUpdateCron.js stündlich um Minute 15
- Nutzt PriceEntry-Daten von Scraper-Service