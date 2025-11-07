# SF-1 � Architektur�bersicht (Stand: 2025-11-01)

## 1. Zweck
Dieses Dokument beschreibt den Gesamtaufbau von SF-1 (SeedFinder PRO): welche Apps es gibt, wo sie im Repo liegen, wie sie �ber Kubernetes auf dem Netcup-Server bereitgestellt werden und wie die Daten vom Scraper bis ins Frontend flie�en. Alle anderen SF-1-Dokumente beziehen sich darauf.

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
- zus�tzliche Manifeste:  
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
2. Daten werden �ber Backend/DB erreichbar gemacht (Mongo aus `k8s/mongo.yaml`).
3. Backend stellt REST-APIs unter `/api/...` bereit (siehe `docs/sf1_backend_apis.md`).
4. Frontend ruft die APIs ab und zeigt sie an.

## 5. Betrieb & Querschnitt
- Monitoring: `docs/sf1_monitoring.md` + `k8s/monitoring/*`
- Backup/Restore: `docs/sf1_backup_restore.md` + `k8s/backup/*`
- CI/CD: `docs/sf1_ci_cd.md`
- Security/Secrets: `docs/sf1_security_secrets_template.md`

## 6. N�chste Aktion
- Wenn neue Route/Service/App hinzukommt ? hier unter **2. Anwendungen** eintragen.
- Wenn neuer k8s-Ordner angelegt wird ? hier unter **3. Infrastruktur** erg�nzen.
# ArchitekturÃ¼bersicht

**Gesamtsystem:**
- Frontend (ReactÂ +Â ViteÂ +Â PWA)
- Backend (NodeÂ +Â ExpressÂ +Â MongoDB)
- ScraperÂ Module (NodeÂ +Â CheerioÂ +Â Axios)
- Datenbank: MongoDBÂ (AtlasÂ /Â lokalÂ /Â Cluster)
- Monitoring: GrafanaÂ +Â PrometheusÂ +Â Loki
- Backup: CronJobsÂ +Â S3
- CI/CD: GitHubÂ Actions â†’ GHCR â†’Â Kubernetes
- Domain: `seedfinderpro.de`
# API-Gateway & OpenAPI-Spezifikation

## Ziel
Zentraler Einstiegspunkt für alle SF-1 API-Routen. Einheitliches Routing, TLS, Canary-Trennung, automatische Dokumentation.

## Komponenten
- **Caddy Ingress**: HTTPS-Gateway für `/api`-Pfad.
- **OpenAPI Spec** (`apps/backend/openapi.yaml`): definiert Routen und Schemas.
- **Swagger-UI / Redoc** (optional): visuelle Doku im Backend aktivierbar.

## Funktionen
| Komponente | Aufgabe |
|-------------|----------|
| Ingress (Caddy) | TLS, Host-Routing, Canary-Separation |
| Backend Express | Endpunkte laut OpenAPI |
| Swagger-UI | Live-Doku |
| Canary Ingress | Separate Subdomain Tests |

## Risiken & Mitigation
- **API nicht erreichbar** → TLS-Zertifikat / Ingress prüfen.  
- **Fehlende Routen** → OpenAPI-Datei veraltet.  
- **Falsche Versionen** → Canary-Namespace prüfen.

## Validierung (nur lesen)
```bash
kubectl get ingress sf1-api-gateway -o yaml
curl -s https://seedfinderpro.de/api/health
# API Spec (v1)

## Auth
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }
- POST /api/auth/logout

## Prices / Seeds
- GET /api/prices/today â†’ [ { name, currentPrices[], lastUpdated } ]
- GET /api/prices/search?query=TERM â†’ [Seed]
- GET /api/seeds/:id â†’ Seed Detail

## Tools
- POST /api/tools/power-cost { watt, kwhPrice, hoursVeg, hoursBloom, hoursPerDayVeg, hoursPerDayBloom }
- POST /api/tools/dli-from-ppfd { ppfd, photoperiodHours }
- POST /api/tools/ppfd-from-dli { dli, photoperiodHours }

## User
- GET /api/user/me
- POST /api/user/favorites { seedId }
- DELETE /api/user { } â†’ Account lÃ¶schen
# API Reference

**Base URL:** `https://seedfinderpro.de/api`

| Endpoint | Methode | Beschreibung |
|-----------|----------|---------------|
| `/health` | GET | Statusâ€‘CheckÂ â†’ `{ status: "ok" }` |
| `/seeds` | GET | Liste aller Seeds mit Preisvergleich |
| `/seed/:id` | GET | Detailansicht eines Seeds |
| `/user/login` | POST | JWTâ€‘basierte Authentifizierung |
| `/user/register` | POST | Neuen Benutzer anlegen |
| `/favorites` | GET/POST/DELETE | Favoriten verwalten |

**Responseâ€‘Beispiel:**
# Styleguide

## Codekonventionen
- Sprache: Deutsch fÃ¼r Dokumentation, Englisch fÃ¼r Code
- Formatierung: PrettierÂ +Â ESLint (`npm run lint:fix`)
- CommitÂ Messages: ConventionalÂ Commits
  - `feat:` neueÂ Funktion
  - `fix:` Bugfix
  - `docs:` DokuÃ¤nderung
  - `chore:` interne Wartung

## Markdown
- 80â€‘Zeichenâ€‘Zeilenbreite
- Tabellen nutzen statt Listen fÃ¼r technische Werte
- CodeblÃ¶cke mit Sprache angeben

## Diagramme
- `mermaid` verwenden fÃ¼r Architektur oder AblÃ¤ufe

## Tests
- Jest/Playwright: deutsch kommentieren, englisch coden
