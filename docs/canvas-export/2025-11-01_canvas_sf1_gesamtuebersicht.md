# SF-1 Projekt-Gesamtübersicht (ULTRA, Stand: 2025-11-01)

## 1. Meta

* Projektname: **SF-1 (SeedFinder PRO)**
* Eigentümer: Callie
* Ziel: Vergleichs-/Wissensplattform für Cannabissamen + integrierter Grow-Guide (UGG-1) + Monetarisierung
* Tech-Stack: React/Vite (Frontend), Node/Express (Backend), eigener Price-/Scraper-Service, Kubernetes auf Netcup, Caddy-Ingress, Domain `seedfinderpro.de`

## 2. Reale Codebasis (ausgelesen)

* **apps/frontend/**: React, Vite, Struktur vorhanden, aber Inhalte noch nicht komplett. Ergänzende Doku: `docs/sf1_frontend_structure.md` + `accessibility.md` + `i18n.md` + `image_pipeline.md` + `link-map.md`.
* **apps/backend/**: Express/Node 20. Routen gefunden:

  * `src/routes/affiliate.ts`
  * `src/routes/analytics.ts`
  * `src/routes/auth.ts`
  * `src/routes/journal.ts`
  * `src/routes/prices.ts`
  * `src/routes/tools.ts`
  * `src/routes/ugg.ts`
  * plus: `apps/backend/imageHandler.ts`, `apps/backend/search.ts`
  * Daraus abgeleitete API-Tabelle: `docs/sf1_backend_apis.md`.
* **apps/price-service/**: Parser-Verzeichnis gefunden:

  * `apps/price-service/src/parsers/list.ts` (Generischer Listen-/Index-Parser)
  * `apps/price-service/src/parsers/zamnesia.ts` (Shop-spezifisch)
  * Tests für diese Parser fehlen → dafür ist `docs/sf1_scraper_matrix.md` vorgesehen.
* **docs/**: sehr umfangreich, ursprüngliche 59 Dateien, jetzt ergänzt um 9 neue SF-1 Kern-Dokumente und in 12 GPT-taugliche Wissenspakete konsolidiert.
* **k8s/**: kompletter Baum vorhanden, d. h. nicht nur 1–2 Deployments, sondern vollständige Unterordner (`analytics`, `backup`, `monitoring`, `scraper`, `security`, `testing`, `ingress`, `configmaps`, `deploy`, `restore-drill`, `policies`). Root enthält alle zentralen Deployments (`backend.yaml`, `price-service.yaml`, `frontend.yaml`, `mongo.yaml`, `ingress-caddy.yaml`, `autoscaling.yaml`, `cdn.yaml`, `gateway.yaml`, `search.yaml`, `redis.yaml`, `mongo-backup.yaml`, `secrets.yaml`).

## 3. K8s-Betrieb (Detail)

* **Ingress:** Caddy, Domain: `seedfinderpro.de` → zentral geregelt in `k8s/ingress-caddy.yaml` + `k8s/ingress/*.yml`.
* **Basis-Reihenfolge** (steht jetzt in `docs/sf1_k8s_deploy.md`):

  1. `k8s/secrets.yaml`
  2. `k8s/mongo.yaml`
  3. `k8s/backend.yaml`
  4. `k8s/price-service.yaml`
  5. `k8s/frontend.yaml`
  6. `k8s/ingress-caddy.yaml`
  7. Danach: thematische Ordner (monitoring, backup, analytics, scraper, security, testing)
* **Themen-Namespaces:**

  * `k8s/analytics/*` → Clickhouse, Postgres, Plausible, Analytics-Ingress
  * `k8s/backup/*` → Backup-NS, PVC, S3-/Mongo-/Rsync-Secrets, CronJobs für mongodump/kubedump/rsync
  * `k8s/monitoring/*` → Loki, Promtail, Prometheus, Grafana, Alertmanager, SLO-Rules
  * `k8s/scraper/*` → Deployment-Worker, Cronjob-Watchdog, HPA, NetworkPolicy, Service-Monitor, Reliability-File
  * `k8s/security/*` → Namespaces-Labeling, NetworkPolicies, Header-Anpassungen
  * `k8s/testing/*` → eigener Namespace + Cronjob für Smoke-Tests
  * `k8s/restore-drill/*` → Cronjob für Restore-Probe
* **Spezial:** `k8s/policies/supply-chain.yaml` → Supply-Chain-/Sicherheitsvorgaben für das Cluster.

## 4. Monitoring (Detail)

* Komponenten (alle real vorhanden):

  * Namespace: `k8s/monitoring/00-namespace.yaml`
  * Loki (Logs): `10-loki-configmap.yaml`, `11-loki-statefulset.yaml`, `12-loki-service.yaml`
  * Promtail (Log-Sammeln): `20-promtail-configmap.yaml`, `21-promtail-daemonset.yaml`
  * Prometheus (Metriken): `30-prometheus-configmap...`, `31-prometheus-deployment.yaml`, `32-prometheus-service.yaml`
  * Rules/Watchdog: `33-prometheus-rules-config...`, `34-prometheus-rules-watchdog...`
  * Grafana: `40-grafana-datasources.yaml`, `41-grafana-dashboards.yaml`, `42-grafana-deployment.yaml`, `43-grafana-service.yaml`, `44-grafana-ingress.yaml`
  * Alertmanager: `50-alertmanager-config...`, `51-alertmanager-deployment...`, `52-alertmanager-service...`, `53-alertmanager-ingress...`
  * SLO: `slo-alerts.yml`, `slo-recording-rules.yml`
* Dazugehörige Doku: `docs/sf1_monitoring.md` (neu) + `docs/alerting-receivers.md` + `docs/alerts-receivers.md` + `docs/ANALYTICS.md` + `docs/PLAUSIBLE-OPERATIONS.md` →

  * **Status:** Monitoring ist architekturseitig da ✅
  * **Offen:** echte Empfänger/Targets für Alerts eintragen 🟡

## 5. Backup & Restore (Detail)

* Doku: `docs/sf1_backup_restore.md` (neu)
* K8s-Teil: `k8s/backup/00-namespace.yaml`, `01-backup-pvc.yaml`, `10-secret-s3.yaml`, `11-secret-mongo.yaml`, `12-secret-rsync.yaml`, `20-mongodump-cronjob.yaml`, `30-kubedump-cronjob.yaml`, `41-rsync-cronjob.yaml`
* Restore-Test: `k8s/restore-drill/cronjob.yml`
* **Sicherheitsregel:** alle Secrets leer/vorbereitet, aber nicht befüllt → Absicht
* **Status:** Mechanik da ✅, echte Credentials fehlen 🟡, regelmäßiger Drill fehlt 🟡

## 6. Backend / API (Detail)

* Erfasste Routen (aus Code):

  * `/api/prices` (Preise) → `apps/backend/src/routes/prices.ts`
  * `/api/ugg` (Grow-Guide) → `apps/backend/src/routes/ugg.ts`
  * `/api/auth` (Login/Token) → `apps/backend/src/routes/auth.ts`
  * `/api/affiliate` (Partner/Monetarisierung) → `apps/backend/src/routes/affiliate.ts`
  * `/api/analytics` (Plausible/Tracking) → `apps/backend/src/routes/analytics.ts`
  * `/api/journal` (Projekt-/Grow-Journal) → `apps/backend/src/routes/journal.ts`
  * `/api/tools` (Rechner/Werkzeuge) → `apps/backend/src/routes/tools.ts`
  * `/api/image` → `apps/backend/imageHandler.ts`
  * `/api/search` → `apps/backend/search.ts`
* Dazu gehört: `docs/sf1_backend_apis.md` → jetzt mit Tabelle (Route, Methoden, Auth, Datei, Beschreibung) → jeder GPT kann daraus echte Endpunkte ziehen.
* **Status:** Routen sind strukturiert ✅, Methoden teils noch „vermutet“ 🟡, Response-Schemas fehlen 🟡.

## 7. Scraper / Price-Service (Detail)

* Parser-Verzeichnis: `apps/price-service/src/parsers/`

  * `list.ts` (generisch)
  * `zamnesia.ts` (shop)
* Doku dazu: `docs/sf1_scraper_matrix.md` (neu), `docs/SCRAPER-GUIDE.md`, `docs/scraper-reliability.md`, `docs/runbook-scraper.md`
* K8s-Runtime: `k8s/scraper/*` (Configmap, Cronjob-Watchdog, Deployment-Worker, HPA, Service-(Monitor), NetworkPolicy, PDB, Reliability-Datei)
* **Status:** Laufzeitumgebung/Scraper-Betrieb ist vorbereitet ✅, konkrete Seedbank-Abdeckung ist klein 🟡, Tests fehlen 🔴
* **Nächste Schritte:** Parser-Tests in `apps/price-service/tests/*.spec.ts` anlegen, weitere Shops (RQS, Seed City, Dutch Passion) per GPT „SF-1 — Scraper & Preis-Parser Engineer“ generieren lassen.

## 8. Frontend (Detail)

* Struktur definiert: `docs/sf1_frontend_structure.md`

  * pages → `apps/frontend/src/pages/`
  * components → `apps/frontend/src/components/`
  * layouts → `apps/frontend/src/layouts/`
  * ads → `apps/frontend/src/components/ads/` (max. 10 %)
* Ergänzende UX-/Content-Dokus: `accessibility.md`, `i18n.md`, `image_pipeline.md`, `link-map.md`
* **Status:** Gerüst steht ✅, echte Seiten (Seeds, Prices, UGG-Viewer, Account) fehlen 🟡 → sollen vom GPT "SF-1 — Frontend / React" erzeugt werden, der genau diese Struktur kennt.

## 9. Security / Compliance (Detail)

* Doku: `docs/DSGVO.md`, `docs/LEGAL-REQUIREMENTS.md`, `docs/secrets-management.md`, `docs/secrets_rotation.md`, `docs/supply_chain_security.md`, `docs/waf-cdn.md`, `docs/RISIKEN.md`
* Template (neu): `docs/sf1_security_secrets_template.md` → listet MONGO_URI, JWT_SECRET, AFFILIATE_KEY, ANALYTICS_KEY + verweist auf k8s/secrets/* und k8s/backup/*-Secrets
* K8s-Sicherheitsanteil: `k8s/security/*` (Namespaces, NetworkPolicies, Headers) + `k8s/policies/supply-chain.yaml`
* **Status:** Regeln da ✅, echte Werte und Rotation einplanen 🟡

## 10. Business / Monetarisierung (Detail)

* Doku: `AFFILIATE-ADS.md`, `ANDROID-TWA.md`
* GPT: „SF-1 — Business & Monetarisierung“ → kennt 10-%-Regel, kennt Affiliate-Felder, kennt Premium-Stufen
* Soll liefern: Platzierungsplan (Startseite, Seed-Detail, Preis-Liste, Account), API-Felder für Backend+Frontend, DSGVO-/Werbe-Kennzeichnung
* **Status:** Konzept da ✅, Backend-Felder und Mappings noch einbauen 🟡

## 11. Übergabe / Doku-Fluss

* Datei: `docs/sf1_uebergabe.md` → Pflichtfelder: Datum (ISO), Kontext, Status, Nächste Aktion, Verantwortlich (Callie), optional Risiko, Artefakt
* GPT: „SF-1 — Docs & Übergabe“ → reagiert auf „Ü“ → hängt nur neuen Block an → gibt nicht alles aus
* **Status:** Prozess steht ✅

## 12. GPT-Landschaft (geplant/teilweise fertig)

* 01 SF-1 — Master / Dispatcher → Wissen: 1, 10, 11 → Einstieg
* 02 SF-1 — Repo & Struktur → Wissen: 1, 2, 10 → ordnet Dateien zu
* 03 SF-1 — Scraper & Preis-Parser Engineer → Wissen: 1, 4, 5 → baut TS-Parser + Vitest
* 04 SF-1 — Backend / API → Wissen: 1, 3, 5 → baut Express-Routen
* 05 SF-1 — Frontend / React → Wissen: 1, 9 → baut Pages/Components
* 06 SF-1 — DevOps / K8s / Netcup → Wissen: 1, 2, 3, 6, 7 → macht nur YAML
* 07 SF-1 — PowerShell & Windows → Wissen: 1, 2 → macht nur PS mit Programm/Ort
* 08 SF-1 — Docs & Übergabe → Wissen: 1, 10, 11 → pflegt Übergabedatei
* 09 SF-1 — UGG-1 Content → Wissen: 12 (plus später UGG-Paket) → schreibt Grow-Guide
* 10 SF-1 — QA / Test / Checks → Wissen: 1,2,3,4,5,6 → prüft Vollständigkeit
* 11 SF-1 — Business & Monetarisierung → Wissen: 1, 8, 10 → Ads, Affiliate, Premium
* 12 SF-1 — Support / Recovery → Wissen: 1, 2, 6, 7 → leitet Fehlerbehebung an

## 13. Ampel (Gesamt)

* **Grün:** Architektur, k8s-Struktur, Backend-Routen, Doku-/Übergabe-Prozess, 12 Knowledge-Pakete
* **Gelb:** Monitoring-Empfänger, Backup-Credentials, Frontend-Seiten, Scraper-Abdeckung, Business-Felder
* **Rot:** Parser-Tests, reale Secrets, vollständige Frontend-UI, produktive Alert-Empfänger

## 14. Nächste Aktionen (priorisiert)

1. Tests für vorhandene Parser anlegen → `apps/price-service/tests/*.spec.ts`
2. In Alertmanager echte Empfänger aus `docs/alerting-receivers.md` eintragen
3. Mind. 2 React-Seiten erzeugen (Seeds, Prices) nach `docs/sf1_frontend_structure.md`
4. Secrets auf dem Cluster befüllen nach `docs/sf1_security_secrets_template.md`
5. GPTs im Builder mit den 12 Knowledge-Dateien neu speichern
