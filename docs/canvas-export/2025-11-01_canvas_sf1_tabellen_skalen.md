# SF-1 Gesamtübersicht (mit Tabellen & Skalen)

## 1. Projektstatus-Skala

| Bereich               | Status | Skala (0–5) | Kommentar                                     |
| --------------------- | ------ | ----------- | --------------------------------------------- |
| Architektur           | ✅      | 5/5         | sauber beschrieben in docs/sf1_architektur.md |
| Kubernetes (Basis)    | ✅      | 5/5         | k8s/* voll, Deploy-Reihenfolge dokumentiert   |
| Monitoring            | 🟡     | 3/5         | Stack da, Empfänger fehlen                    |
| Backup & Restore      | 🟡     | 3/5         | Jobs/Drill da, Secrets fehlen                 |
| Scraper/Price-Service | 🟡     | 3/5         | 2 Parser, aber keine Tests                    |
| Frontend              | 🟡     | 2/5         | Struktur da, Seiten fehlen                    |
| Security/Secrets      | 🟡     | 3/5         | Regeln da, Werte fehlen                       |
| Business/Monetaris.   | 🟡     | 2/5         | Konzept da, Backend-Felder fehlen             |
| Docs & Übergabe       | ✅      | 5/5         | Prozess „Ü“ steht                             |

**Legende Skala:** 0 = nicht angefangen, 1 = angelegt, 2 = Grundgerüst, 3 = funktionsfähig, 4 = fast fertig, 5 = fertig/pflegbar.

---

## 2. Systemgrafik (Text)

```text
                 +-------------------------+
                 |  Scraper (k8s/scraper/*)|
                 |  + apps/price-service   |
                 +-----------+-------------+
                             |
                             v
                    +----------------+
                    |   MongoDB      |  <-- k8s/mongo.yaml
                    +----------------+
                             |
                             v
                  +---------------------+
                  |  Backend/API        |  <-- apps/backend/src/routes/*
                  +----------+----------+
                             |
                             v
                 +------------------------+
                 |   Frontend (React)     |  <-- apps/frontend/
                 +------------------------+
                             |
                             v
                    User @ seedfinderpro.de
```

Monitoring/Backup hängen seitlich dran:

```text
[Monitoring (k8s/monitoring/*)] ---> sammelt Metriken/Logs/Alerts
[Backup (k8s/backup/*)]       ---> sichert Mongo + K8s
```

---

## 3. Kubernetes-Baum (aus Repo)

| Ebene  | Ordner/Datei           | Zweck                                    |
| ------ | ---------------------- | ---------------------------------------- |
| Root   | k8s/backend.yaml       | Backend bereitstellen                    |
| Root   | k8s/price-service.yaml | Price-/Scraper-Service                   |
| Root   | k8s/frontend.yaml      | React-Frontend                           |
| Root   | k8s/mongo.yaml         | Datenbank                                |
| Root   | k8s/ingress-caddy.yaml | Einstieg über seedfinderpro.de           |
| Root   | k8s/autoscaling.yaml   | HPA global                               |
| Root   | k8s/cdn.yaml           | WAF/CDN                                  |
| Root   | k8s/gateway.yaml       | Gateway/Proxy                            |
| Root   | k8s/search.yaml        | Suchdienst                               |
| Ordner | k8s/analytics/*        | Plausible/Clickhouse/Postgres            |
| Ordner | k8s/backup/*           | Namespace + CronJobs + Secrets           |
| Ordner | k8s/monitoring/*       | Prometheus, Grafana, Loki, Alertmanager  |
| Ordner | k8s/scraper/*          | Worker + Watchdog + HPA + ServiceMonitor |
| Ordner | k8s/security/*         | NetworkPolicies, Header                  |
| Ordner | k8s/testing/*          | Smoke-Tests                              |
| Ordner | k8s/restore-drill/*    | Wiederherstellungsprobe                  |

---

## 4. Doku-Landkarte (12er-Pakete)

| Paket-Nr. | Dateiname                                   | Inhalt kurz                                    |
| --------- | ------------------------------------------- | ---------------------------------------------- |
| 1         | sf1-01-core-architecture.md                 | Architektur, APIs, Styleguide                  |
| 2         | sf1-02-runtime-k8s-deploy.md                | Setup, Deploy, Autoscaling, Troubleshooting    |
| 3         | sf1-03-security-compliance.md               | DSGVO, Legal, Secrets, WAF, Supply Chain       |
| 4         | sf1-04-scraper-stack.md                     | Scraper-Guides, Reliability, Runbooks          |
| 5         | sf1-05-ci-cd-deps-versioning.md             | CI, Deploy, Deps, Contribution, Versioning     |
| 6         | sf1-06-monitoring-alerting-analytics-slo.md | Monitoring, Alerts, Analytics, SLO/SI          |
| 7         | sf1-07-disaster-recovery.md                 | Backup, Restore, Postmortems                   |
| 8         | sf1-08-business-and-affiliates.md           | Affiliate, Ads, Android TWA                    |
| 9         | sf1-09-frontend-ux-content.md               | Frontend-Struktur, i18n, Accessibility, Images |
| 10        | sf1-10-planning-roadmap.md                  | ROADMAP, PLAN-Varianten A/B/C                  |
| 11        | sf1-11-handover-master.md                   | Übergabe, Ü-Regel                              |
| 12        | sf1-12-tools-and-formulas.md                | Tools, Formeln, Hilfstabellen                  |

---

## 5. Offene Arbeiten (mit Priorität)

| Prio | Aufgabe                                   | Bereich    | Datei/Ort                                  | Status |
| ---- | ----------------------------------------- | ---------- | ------------------------------------------ | ------ |
| P1   | Vitest für list.ts + zamnesia.ts          | Scraper    | apps/price-service/tests/*.spec.ts         | offen  |
| P1   | Alertmanager-Empfänger ergänzen           | Monitoring | k8s/monitoring/50-alertmanager-config...   | offen  |
| P1   | Secrets auf Cluster einspielen            | Security   | laut docs/sf1_security_secrets_template.md | offen  |
| P2   | Frontend-Seiten (Seeds, Prices) bauen     | Frontend   | apps/frontend/src/pages/                   | offen  |
| P2   | Business-Felder im Backend ergänzen       | Business   | apps/backend/src/routes/affiliate.ts       | offen  |
| P3   | Scraper-Matrix um weitere Shops erweitern | Scraper    | docs/sf1_scraper_matrix.md                 | offen  |
| P3   | Restore-Drill einmal ausführen            | Backup     | k8s/restore-drill/cronjob.yml              | offen  |

---

## 6. Kleine Reifegrad-Grafik (ASCII)

```text
Architektur        [#####] 5/5
Kubernetes         [#####] 5/5
Monitoring         [###  ] 3/5
Backup/Restore     [###  ] 3/5
Scraper            [###  ] 3/5
Frontend           [##   ] 2/5
Business           [##   ] 2/5
Security (real)    [###  ] 3/5
Docs & Übergabe    [#####] 5/5
```

## 7. Nächste Visualisierung (optional)

* PNG/Diagramm kann später aus diesen Tabellen gebaut werden
* Reihenfolge bleibt: Basis (k8s) → Betrieb (Monitoring/Backup) → Feature (Scraper/Frontend) → Geld (Business)
