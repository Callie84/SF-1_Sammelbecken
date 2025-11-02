# SF-1 Arbeitsansicht

## 1. Offene Kernaufgaben (Top 10)

| Nr. | Aufgabe                                  | Bereich    | Datei/Ziel                                 | Status | Nächste Aktion          |
| --- | ---------------------------------------- | ---------- | ------------------------------------------ | ------ | ----------------------- |
| 1   | Parser-Tests für list.ts, zamnesia.ts    | Scraper    | apps/price-service/tests/*.spec.ts         | offen  | Tests schreiben         |
| 2   | Alertmanager-Empfänger eintragen         | Monitoring | k8s/monitoring/50-alertmanager-config...   | offen  | Mails/Webhooks ergänzen |
| 3   | Frontend-Seiten Seeds & Prices bauen     | Frontend   | apps/frontend/src/pages/Seeds.tsx          | offen  | Seite generieren        |
| 4   | Secrets auf Cluster befüllen             | Security   | nach docs/sf1_security_secrets_template.md | offen  | Secrets einspielen      |
| 5   | Business-Felder im Backend ergänzen      | Business   | apps/backend/src/routes/affiliate.ts       | offen  | Feldliste übernehmen    |
| 6   | Scraper-Matrix erweitern (weitere Shops) | Scraper    | docs/sf1_scraper_matrix.md                 | offen  | Shops eintragen         |
| 7   | Restore-Drill testen                     | Backup     | k8s/restore-drill/cronjob.yml              | offen  | Cronjob ausführen       |
| 8   | k8s-Doku erneut konsolidieren            | Doku       | docs/gpt-knowledge/*.md                    | offen  | PS-Block ausführen      |
| 9   | QA-GPT erstellen/füttern                 | QA         | GPT „SF-1 — QA / Test / Checks“            | offen  | GPT anlegen             |
| 10  | UGG-1 Kernpaket bauen                    | Content    | docs/ugg-*.md (später)                     | offen  | Kapitel sammeln         |

## 2. System-Grafik (ASCII)

```text
[Scraper (k8s/scraper/*) + apps/price-service/src/parsers/*]
                |
                v
        [MongoDB (k8s/mongo.yaml)]
                |
                v
[Backend (apps/backend/src/routes/*)]  <--->  [Monitoring (k8s/monitoring/*)]
                |
                v
  [Frontend (apps/frontend/...)]  <--->  [Business Layer (Affiliate, Ads ≤10%)]
                |
                v
       [User / seedfinderpro.de]
```

## 3. Kubernetes-Bereiche

| Bereich    | Ordner          | Wichtigste Dateien/Ordner                                                       |
| ---------- | --------------- | ------------------------------------------------------------------------------- |
| Basis      | k8s/            | backend.yaml, price-service.yaml, frontend.yaml, mongo.yaml, ingress-caddy.yaml |
| Monitoring | k8s/monitoring/ | 00-namespace, prom, grafana, alertmanager, slo-*                                |
| Backup     | k8s/backup/     | 00-namespace, *-secret-*.yaml, mongodump, kubedump                              |
| Scraper    | k8s/scraper/    | deployment-worker, cronjob-watchdog, hpa, service-monitor                       |
| Security   | k8s/security/   | networkpolicies, headers.yaml                                                   |
| Testing    | k8s/testing/    | 00-namespace, smoke-cronjob                                                     |

## 4. Doku-Bausteine

| Dokument                              | Zweck                               | GPT-Wissen |
| ------------------------------------- | ----------------------------------- | ---------- |
| docs/sf1_architektur.md               | Gesamtaufbau SF-1                   | 1          |
| docs/sf1_k8s_deploy.md                | echte Deploy-Reihenfolge            | 2          |
| docs/sf1_backend_apis.md              | alle /api/... Routen                | 1,4        |
| docs/sf1_scraper_matrix.md            | Parser-Übersicht + k8s-Scraper      | 4          |
| docs/sf1_monitoring.md                | Monitoring-Stack aus k8s/monitoring | 6          |
| docs/sf1_backup_restore.md            | Backup-/Restore-Mechanik            | 7          |
| docs/sf1_ci_cd.md                     | CI/CD-Reihenfolge + Smoke/smoke     | 5          |
| docs/sf1_frontend_structure.md        | Pfade fürs FE                       | 9          |
| docs/sf1_security_secrets_template.md | Secret-Namen + Regeln               | 3          |

## 5. Mini-Roadmap (4 Blöcke)

1. **Block 1 – Technisch sauber machen**: Tests für Scraper, Monitoring-Empfänger, Secrets → dann ist Betrieb stabil.
2. **Block 2 – Feature sichtbar machen**: 2–3 Frontend-Seiten + API-Felder für Business → dann ist SF-1 „benutzbar“.
3. **Block 3 – Inhalte nachladen**: UGG-1 Kapitel, Scraper-Matrix erweitern → dann mehr Value.
4. **Block 4 – Automatisieren**: Docs-GPT immer mit neuer Konsolidierung füttern, QA-GPT aktivieren.
