💡 Stromkosten- & Ertragsrechner – Teil 2:
- Service:
  • compareScenarios(scenarios[]): Berechnet powerCost & yield für jedes Szenario
  • exportScenariosCSV(scenarios[]): Gibt CSV-String mit Szenario-Daten
- Controller:
  • POST /calc/compare { scenarios } → JSON-Ergebnisse
  • POST /calc/compare/export { scenarios } → CSV-Download (scenarios.csv)
- Beispiel Szenario: { name, watt, hoursPerDay, pricePerKwh, areaSqm, gramsPerSqm }