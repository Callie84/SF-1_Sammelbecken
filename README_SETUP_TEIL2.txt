🛠 Setup-Planer – Teil 2:
- Visuelle Konfiguration:
  • Modell: RoomLayout (name, width, length, placements[{itemId, position}])
- Controller & Routen (auth):
  • POST /planner/layout { id?, name, width, length, placements } → speichern/updaten
  • GET /planner/layouts → alle Layouts
  • POST /planner/layout/:id/prices → Preise aller Items via Partner-API stub
- Services:
  • upsertLayout(), listLayouts(), fetchPartnerPrices()
- Extension: Anbindung echter Partner-APIs für Echtzeit-Preise