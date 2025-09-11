📊 Stromkosten/Ertragsrechner – Teil 4:
- Prognose und Szenario-Vergleich:
  • forecastScenario({ name, watt, hoursPerDay, pricePerKwh, areaSqm, gramsPerSqm, days })
    → liefert { name, daily: [{ day, cost }], yieldTotal }
- CSV-Export:
  • exportForecastCSV(forecasts) → CSV-String mit Feldern name, day, cost, yieldTotal
- Controller:
  • POST /calc/forecast { scenarios, days } → JSON-Prognosen
  • POST /calc/forecast/export { scenarios, days } → CSV-Download
- Routen unter `/calc` (auth-geschützt)