# SF-1 — CI & Deploy (Stand: 31.10.2025)

## 1. Workflows (GitHub)
Aktiv im Repo (`.github/workflows/`):

- `price-service.yml`
  - löst bei Änderungen unter `apps/price-service/**` aus
  - macht: `npm ci` → `npm run build` → `npm run test:fixtures`
  - fährt am Ende den Snapshot: `npm run snapshot:zamnesia || echo ...`
- `backend.yml`
  - Basis-Build für das Backend
- `frontend.yml`
  - Basis-Build für das Frontend
- `seedscan.yml`
  - Basis-Lauf für Seedscan
- `e2e.yml`
  - triggert **nur**, wenn `backend` **und** `frontend` erfolgreich waren
- `docker-backend.yml` / `docker-price-service.yml`
  - bauen Images aus `Dockerfile.backend` bzw. `Dockerfile.price-service`
- `smoke.yml`
  - schneller Check / kann für “Smoke/smoke” genutzt werden

## 2. Lokales CI-Skript
Datei: `scripts/sf1-local-ci.ps1`

Führt aus:

1. `apps/price-service` → `npm run build` → `npm run test:fixtures`
2. Backend-Placeholder
3. Seedscan-Placeholder
4. `npm run e2e --if-present`

Aufruf:

```powershell
pwsh -NoLogo -File .\scripts\sf1-local-ci.ps1
