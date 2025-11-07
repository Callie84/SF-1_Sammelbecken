# Risiken & GegenmaÃŸnahmen

## Infrastruktur
- Singleâ€‘Node Ausfall â†’ tÃ¤gliche Dumps, wÃ¶chentlich Offâ€‘Site, Restoreâ€‘Test monatlich
- Zertifikatsfehler â†’ cert-manager Events prÃ¼fen, DNS/HTTPâ€‘01 Pfad korrekt, Fallback Stagingâ€‘CA

## Sicherheit
- Secrets in Git â†’ Verboten; nur K8s Secrets, CI via GitHub Secrets
- XSS/CSRF â†’ Helmet, CSP (script-src 'self'), SameSite=Lax Cookies, Zodâ€‘Validation
- Bruteâ€‘Force â†’ Rateâ€‘Limit Login 5/min/IP, Exponential Backoff

## Daten/DB
- Schreibkonflikte â†’ Upsert mit Filter (seedId, seedbank), Idempotente Scraper Writes
- DBâ€‘Wachstum â†’ priceHistory TTL optional, Archivierung

## Scraper
- 403/429 â†’ Rate erhÃ¶hen, Backoff, Adapter pausieren, Kontakt Partner
- DOMâ€‘Ã„nderungen â†’ Selectorâ€‘Map versionieren, 0â€‘Treffer Alert, schnelle Patchâ€‘Pipeline

## Kosten/Bandbreite
- Peak Traffic â†’ statische Assets cachen, Bildkompression, spÃ¤ter CDN
- Storage â†’ BildgrÃ¶ÃŸenlimit, WebP, automatische Komprimierung

## Recht/Compliance
- DSGVO â†’ Datensparsamkeit, Export/Delete, Impressum/Datenschutz sichtbar
- robots.txt â†’ respektieren; keine Captchaâ€‘Umgehung