# Scraper Guide

## Prinzipien
- robots.txt respektieren (Minimalâ€‘Check enthalten). Keine Captchaâ€‘Umgehung.
- Niedrige Requestâ€‘Rate, kurze Pausen zwischen Seiten (sleep 1â€“2 s+).
- Selektoren versionieren. Bei 0 Treffern Alarm im Log.

## Neues Adapterâ€‘Modul anlegen
1) Datei unter `src/adapters/<partner>.ts` erstellen.
2) `seedbank`, `startUrl`, `run(page)` implementieren.
3) In `index.ts` in `pickAdapter` & `targetToOrigin` registrieren.
4) K8s CronJob YAML kopieren, TARGET anpassen.

## Normalisierung
- `NormalizedPrice`: name, seedbank, price(EUR), currency.
- Gruppierung pro Strain â†’ `currentPrices[]` fÃ¼r DBâ€‘Upsert.

## Persistenz
- Upsert setzt `currentPrices` und `lastUpdated` auf `now`.
- Optionaler Verlauf: zusÃ¤tzlich `priceHistory` im Backend pflegen.

## Fehlerbehandlung
- Sammlung in `errors[]`, Ausgabe im Log.
- Bei HTTP 403/429 Job abbremsen (Schedule/Delay erhÃ¶hen) und Adapter prÃ¼fen.