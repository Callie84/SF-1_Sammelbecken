📢 Werbung & Affiliate – Teil 2:
- Service:
  • getAdsByPosition(position, limit) → Zufällige Rotation
  • recordImpression(adId), recordClick(adId)
- Controller:
  • GET /ads/serve/:position → liefert eine Ad JSON + erhöht Impression
  • POST /ads/click/:id → erhöht Klick-Zähler
- Modell: Ad (inkl. impressions, clicks)