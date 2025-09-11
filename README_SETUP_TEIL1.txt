🛠 Setup-Planer – Teil 1:
- Modell: SetupItem (name, category, quantity, unitPrice, purchased)
- Service:
  • addItem(userId, item) → new SetupItem
  • calculateBudget(userId) → Summe aller Kosten
- Controller & Routen (auth-geschützt):
  • POST /setup/items { name, category, quantity, unitPrice }
  • GET /setup/items
  • GET /setup/budget
  • PUT /setup/items/:id/purchase
- Anwendung: Erstelle und verwalte deine Grow-Equipment-Liste, sehe Gesamtbudget