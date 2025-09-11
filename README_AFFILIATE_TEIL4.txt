📈 Affiliate-System – Teil 4: Integrierter Preisvergleich
- Service:
  • updateAllPrices(): Scrape + Partner-API Connectoren (SeedExpress, GreenShop)
  • getCombinedOffers(strain): Liefert kombinierte PriceEntry-Einträge sortiert nach Preis
- Controller & Routen:
  • POST /affiliate/update-all (Admin) → volle Aktualisierung aller Preise
  • GET /affiliate/offers/:strain → Preisangebote pro Strain
  • Mount unter `/api` wie `routes/integratedAffiliate.js`
- Abhängigkeiten: priceScraperService, affiliateConnectorService, PriceEntry, Seed
- Nutzung: Einheitliche Aufrufe statt separater Endpunkte