# Caching (Redis) für SF-1

## Ziel
Antwortzeiten senken, Last auf DB/Scraper verringern. Sicher, nachvollziehbar, ohne Code-Duplikate.

## Architektur
- **Redis (StatefulSet)** mit PVC, Auth via Secret `sf1-secrets: REDIS_PASS`.
- **Backend Cache-Layer** (`apps/backend/cache.ts`) als zentrale API:
  - `getJSON<T>(key)`
  - `setJSON(key, value, ttlSec, { jitter })`
  - `wrapJSON(key, ttl, fetchFn)` (Cache-Aside)
- **Service** `sf1-redis:6379` im Namespace `default`.
- **NetworkPolicy** erlaubt Zugriff nur von `sf1-backend` Pods.

## Key-Konvention
`sf1:{bereich}:{sub}:{id}`
- Beispiel: `sf1:price:seed:{seedId}`

## TTLs (Richtwerte)
- Preisliste: 300–600 s (+ Jitter 0–60 s)
- Seed-Metadaten: 3600 s
- User-Profile: 300 s (kein sensibles Zeug im Cache)

## Sicherheit
- Kein PII im Cache. Nur öffentliche/ableitbare Daten.
- Auth: Passwort aus `sf1-secrets.REDIS_PASS` (Rotation siehe `docs/secrets_rotation.md`).
- Kyverno: Zugriff nur von zugelassenen Deployments (NetworkPolicy).

## Fehlerverhalten
- Redis down → API liefert **trotzdem** Daten (Bypass). Logging mit Rate-Limit.
- Schreibfehler → nur Log, keine 5xx.

## Tests (Lesekontrollen, nichts ausführen)
- Connection-Check im Backend-Log: „[SF-1] Redis verbunden“.
- Keys prüfen: `INFO keyspace` (Admin), oder Metriken/Dashboards.

**Stand:** 2025-10-17
