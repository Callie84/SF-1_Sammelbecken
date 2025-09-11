🛠 Setup-Planer II – Teil 1:
- **Room Templates**:
  • data/roomTemplates.json mit vordefinierten Raumgrößen und ID
  • GET /planner/templates
  • GET /planner/templates/:id
- **Partner-API-Stubs**:
  • searchPartnerProducts(query): simulierter Produkt-Suchdienst
  • addToPartnerCart(userId, productId): simulierter Warenkorb-Aufruf
  • GET /planner/partner/search?q=
  • POST /planner/partner/cart { productId }
- Auth erforderlich