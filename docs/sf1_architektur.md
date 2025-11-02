# SF-1 — Architekturübersicht (Stand: 2025-11-01)

## 1. Zweck
Dieses Dokument beschreibt den Gesamtaufbau von SF-1 (SeedFinder PRO): welche Apps es gibt, wo sie im Repo liegen, wie sie über Kubernetes auf dem Netcup-Server bereitgestellt werden und wie die Daten vom Scraper bis ins Frontend fließen. Alle anderen SF-1-Dokumente beziehen sich darauf.

## 2. Anwendungen
- **Frontend** ? `apps/frontend/`
  - React/Vite
  - Seiten: `apps/frontend/src/pages/`
  - Komponenten: `apps/frontend/src/components/`
  - Ads (max. 10 %): `apps/frontend/src/components/ads/`
- **Backend / API** ? `apps/backend/`
  - Express/Node 20
  - Routen unter: `apps/backend/src/routes/`
  - aktuell im Repo: `affiliate.ts`, `analytics.ts`, `auth.ts`, `journal.ts`, `prices.ts`, `tools.ts`, `ugg.ts`
  - plus: `apps/backend/imageHandler.ts`, `apps/backend/search.ts`
- **Price-/Scraper-Service** ? `apps/price-service/`
  - Parser: `apps/price-service/src/parsers/` (im Repo: `list.ts`, `zamnesia.ts`)
  - Tests SOLLEN nach: `apps/price-service/tests/`
- **Dokumentation** ? `docs/`

## 3. Infrastruktur (Kubernetes, Netcup)
- zentrale Manifeste im Root:  
  - `k8s/backend.yaml`  
  - `k8s/price-service.yaml`  
  - `k8s/frontend.yaml`  
  - `k8s/mongo.yaml`  
  - `k8s/ingress-caddy.yaml`
- zusätzliche Manifeste:  
  - `k8s/autoscaling.yaml`  
  - `k8s/cdn.yaml`  
  - `k8s/cert-issuer.yaml`  
  - `k8s/gateway.yaml`  
  - `k8s/search.yaml`  
  - `k8s/redis.yaml`  
  - `k8s/mongo-backup.yaml`
- thematische Ordner (werden als eigene Namespaces oder Bereiche genutzt):  
  - `k8s/analytics/*`  
  - `k8s/backup/*`  
  - `k8s/monitoring/*`  
  - `k8s/testing/*`  
  - `k8s/security/*`  
  - `k8s/scraper/*`  
  - `k8s/policies/*`  
  - `k8s/restore-drill/*`
- Ingress: **caddy**
- Domain: **seedfinderpro.de**

## 4. Datenfluss
1. Scraper (Deployments/Cronjobs aus `k8s/scraper/*` + Parser aus `apps/price-service/`) holen Seed-/Preisdaten.
2. Daten werden über Backend/DB erreichbar gemacht (Mongo aus `k8s/mongo.yaml`).
3. Backend stellt REST-APIs unter `/api/...` bereit (siehe `docs/sf1_backend_apis.md`).
4. Frontend ruft die APIs ab und zeigt sie an.

## 5. Betrieb & Querschnitt
- Monitoring: `docs/sf1_monitoring.md` + `k8s/monitoring/*`
- Backup/Restore: `docs/sf1_backup_restore.md` + `k8s/backup/*`
- CI/CD: `docs/sf1_ci_cd.md`
- Security/Secrets: `docs/sf1_security_secrets_template.md`

## 6. Nächste Aktion
- Wenn neue Route/Service/App hinzukommt ? hier unter **2. Anwendungen** eintragen.
- Wenn neuer k8s-Ordner angelegt wird ? hier unter **3. Infrastruktur** ergänzen.
