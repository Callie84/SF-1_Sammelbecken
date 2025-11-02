📈 Affiliate-System – Teil 3: Partner-API-Konnektoren
- Service:
  • fetchSeedExpressOffers(strain): ruft https://api.seedexpress.com/offers ab
  • fetchGreenShopOffers(strain): ruft https://api.greenshop.com/v1/seeds ab (API-Key benötigt)
- Controller:
  • GET /affiliate/connect/seedexpress/:strain → Offers von SeedExpress
  • GET /affiliate/connect/greenshop/:strain → Offers von GreenShop
- Route:
  • routes/affiliateConnect.js (mount unter /api/affiliate)
- Auth: authMiddleware (nutzer muss eingeloggt sein)
- Nutzung: Integriere Echtzeit-Angebote via Partner-APIs statt Scraping