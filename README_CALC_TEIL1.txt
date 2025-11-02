💡 Stromkosten- & Ertragsrechner – Teil 1:
- Service:
  • calculatePowerCost(watt, hoursPerDay, pricePerKwh) → { kwhPerDay, costPerDay }
  • estimateYield(areaSqm, gramsPerSqm) → { areaSqm, gramsPerSqm, yieldTotal }
- Controller:
  • POST /calc/power { watt, hoursPerDay, pricePerKwh }
  • POST /calc/yield { areaSqm, gramsPerSqm }
- Auth erforderlich