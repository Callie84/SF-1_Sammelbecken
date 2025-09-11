🌿 SeedFinder Core – Teil 3: Detailseite & Affiliate-Link Integration
- Service: getSeedDetail(strain):
  • Holt Seed-Daten
  • Preis-Einträge (PriceEntry) aggregieren
  • AffiliateLink-Integration: Kartierung pro Seedbank
  • Rückgabe: JSON mit allen Angeboten unter 'offers'
- Controller: GET /api/seeds/:strain
- Modelle benötigt: Seed, PriceEntry, AffiliateLink
- Antwort: Seed-Objekt + offers = [{ seedbank, price, currency, affiliateUrl }]