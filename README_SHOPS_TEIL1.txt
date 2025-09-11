🏬 Seedbank/Shop-Verwaltung & Bewertung – Teil 1:
- **Modelle**:
  • Shop (name, country, paymentMethods, affiliateId, rating)  
  • Review (shopId, userId, rating, comment)  
- **Controller & Routen**:
  • GET /shops → Liste aller Shops  
  • POST /shops (Admin) → Shop hinzufügen  
  • POST /reviews → Bewertung hinzufügen  
  • GET /reviews/:shopId → Bewertungen auflisten  
- **Mittelware**:
  • authMiddleware, roleMiddleware für Admin-Route