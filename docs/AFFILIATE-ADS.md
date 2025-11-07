# Affiliate & Ads

## Redirectâ€‘Service
- Route: `GET /go/:partner/:slug`
- Datenmodell: `affiliates { partner, baseUrl, params, active }`
- Tracking: Klickâ€‘ZÃ¤hler (serverseitig), UTM an Ziel
- Datenschutz: keine PII; IP nicht speichern

## Bannerâ€‘Slots
- Komponenten: `<Banner slot="top|side|inline" context="seed|search|home" />`
- Frequency: localStorage Counter, keine 3rdâ€‘Party Scripts

## QualitÃ¤t
- BildgrÃ¶ÃŸen â‰¤ 200 KB, WebP bevorzugt, Lazyâ€‘Load