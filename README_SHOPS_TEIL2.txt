🏬 Seedbank/Shop-Verwaltung & Bewertung – Teil 2:
- Admin-Funktionen:
  • PUT /shops/:id → Shop-Daten aktualisieren (name, country, paymentMethods, rating)
  • DELETE /shops/:id → Shop inkl. aller Reviews löschen
  • DELETE /reviews/:id → einzelne Bewertung entfernen
- Logging via AdminLogService (UPDATE_SHOP, DELETE_SHOP, DELETE_REVIEW)