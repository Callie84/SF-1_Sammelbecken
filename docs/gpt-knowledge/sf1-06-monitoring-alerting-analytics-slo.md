# SF-1 � Monitoring & Alerting (Stand: 2025-11-01)

## 1. Namespace
- Alle Monitoring-Komponenten laufen im Namespace **monitoring**.
- Namespace-Manifest: `k8s/monitoring/00-namespace.yaml`

## 2. Logging / Metriken
- Loki: `k8s/monitoring/10-loki-configmap.yaml`, `11-loki-statefulset.yaml`, `12-loki-service.yaml`
- Promtail (Logs einsammeln): `k8s/monitoring/20-promtail-configmap.yaml`, `21-promtail-daemonset.yaml`
- Prometheus (Metriken): `k8s/monitoring/30-prometheus-configmap...` bis `32-prometheus-service.yaml`
- Recording/Rules: `k8s/monitoring/33-prometheus-rules-config...`, `34-prometheus-rules-watchdog...`
- SLO: `k8s/monitoring/slo-alerts.yml`, `k8s/monitoring/slo-recording-rules.yml`

## 3. Visualisierung
- Grafana Deployment: `k8s/monitoring/42-grafana-deployment.yaml`
- Grafana Service: `k8s/monitoring/43-grafana-service.yaml`
- Grafana Ingress: `k8s/monitoring/44-grafana-ingress.yaml`
- Dashboards/Datasources: `k8s/monitoring/40-grafana-datasources.yaml`, `41-grafana-dashboards.yaml`

## 4. Alerts
- Alertmanager Config: `k8s/monitoring/50-alertmanager-config...`
- Alertmanager Deployment/Service/Ingress: `51-...`, `52-...`, `53-...`
- Empf�nger siehe: `docs/alerting-receivers.md` und `docs/alerts-receivers.md`
- Ziel: Ausf�lle von backend, price-service, scraper und backup melden

## 5. �berwachte SF-1-Dienste
- Backend: `k8s/backend.yaml`
- Frontend: `k8s/frontend.yaml`
- Price-Service: `k8s/price-service.yaml`
- Scraper: alle `k8s/scraper/*`
- Backup-Jobs: `k8s/backup/*`
- Analytics/Plausible: `k8s/analytics/*` (optional)

## 6. N�chste Aktion
- Alert-Empf�nger mit realen Mails/Webhooks erg�nzen
- Grafana-URL im Projekt-Doku festhalten
# Alertmanager Receiver (Eâ€‘Mail + Slack)

## Ziele
- Kritische Alerts â†’ Slack + Eâ€‘Mail
- Warnungen â†’ Eâ€‘Mail
- Watchdog feuert dauerhaft (Heartbeat) â†’ bestÃ¤tigt Pipeline

## EmpfÃ¤nger
- Slack: `#alerts` via Incoming Webhook
- Eâ€‘Mail: `ops@seedfinderpro.de`

## Sicherheit
- Komplette Alertmanagerâ€‘Konfiguration liegt als **Secret** (`alertmanager-config-secret`) vor, nicht als ConfigMap.
- SMTPâ€‘Passwort befindet sich nur im Secret.

Status: Fertig. Kein Rollout in diesem Schritt.
NÃ¤chste Aktion: SpÃ¤ter `scripts/alerting-receiver-deploy.ps1` ausfÃ¼hren.
# Alertmanager Receiver

## Routing
- `severity=critical` â†’ Eâ€‘Mail + Telegram
- `severity=warning`  â†’ Slack
- Default â†’ Eâ€‘Mail

## Annahmen
- SMTP: mailbox.org (Beispiel). Ersetze bei Bedarf Server/Absender.
- Telegram: Bot + Channel/Chat vorhanden.
- Slack: Incoming Webhook aktiv.

## Test
- `scripts/alerts-send-test.ps1 -Type critical`
- `scripts/alerts-send-test.ps1 -Type warning`

Status: Fertig. Keine AusfÃ¼hrung bis Goâ€‘Live.
NÃ¤chste Aktion: Falls abweichende Provider genutzt werden, Werte in YAML anpassen.
# Analytics (Plausible selfâ€‘hosted)

## Events
- `search_performed { term_len, results }`
- `seed_view { seedId }`
- `affiliate_click { partner }`

## Dashboards
- Topâ€‘Seeds, Topâ€‘Flows, Exitâ€‘Pages

## Datenschutz
- IP anonymisiert, keine Cookies, Optâ€‘Out Link bereitstellen

## Integration
- Frontend: sendet Events via `fetch("/api/analytics")`
- Backend: leitet anonymisiert an Plausible weiter
- Ingress: eigener Subdomain `analytics.seedfinderpro.de`

## Umgebungsvariablen
- PLAUSIBLE_URL
- PLAUSIBLE_SECRET
- ANALYTICS_MODE=plausible
- CONSENT_REQUIRED=true

## Wartung
- Backup der Plausible-DB täglich via `sf1-backup`
- Alerts bei HTTP 5xx in `analytics` Namespace

## CMP
- ConsentModal prüft `sf1_consent` in `localStorage`
- Ohne Zustimmung keine Event-Sendungen
# Plausible Betrieb

## Erstkonfiguration
1) `kubectl apply -f k8s/analytics/*.yaml` in Reihenfolge: namespace â†’ postgres â†’ clickhouse â†’ plausible â†’ ingress
2) Ã–ffne https://analytics.seedfinderpro.de und lege die Site `seedfinderpro.de` an.
3) PrÃ¼fe, dass `/js/script.js` unter https://seedfinderpro.de/js/script.js geladen wird.

## Backups
- Postgres: Standardâ€‘PVC â†’ CronJob fÃ¼r `pg_dump` optional ergÃ¤nzen
- ClickHouse: Volume Snapshot; optional S3â€‘Backup per clickhouseâ€‘backup Tool

## Monitoring
- Health: `GET /` der plausibleâ€‘Service (HTTP 200)
- Logs: `kubectl logs deploy/plausible -n analytics`

## Sicherheit
- Adminâ€‘Registrierung per `DISABLE_REGISTRATION=true` blockiert
- Zugriff auf UI ggf. mit BasicAuthâ€‘Middleware schÃ¼tzen (Traefik)
# SLO/SLI â€” Definitionen

## Begriffe
- **SLI**: MessgrÃ¶ÃŸe, z.â€¯B. Fehlerrate oder Latenz.
- **SLO**: Zielwert, z.â€¯B. Fehlerrate â‰¤ 0,1â€¯%.
- **Error Budget**: 100â€¯% âˆ’ SLO, z.â€¯B. 0,1â€¯% Ausfall erlaubt in 30 Tagen.

## SFâ€‘1 SLI
1. **API Fehlerrate**: Anteil `status_code>=500` an allen Requests.
2. **API Latenz**: p95/p99 von `http_request_duration_seconds`.
3. **Extern VerfÃ¼gbarkeit**: Anteil `probe_success==1`.

## SLO
- Fehlerrate â‰¤ 0,1â€¯% auf 30 Tage.
- p95 â‰¤ 300â€¯ms (5 Min), p99 â‰¤ 600â€¯ms (5 Min).
- VerfÃ¼gbarkeit â‰¥ 99,9â€¯% auf 30 Tage.

## Visualisierung
- Grafanaâ€‘Dashboard `sf1-slo-overview` zeigt SLIs, Error Budget, Burn Rate und Latenzen.

## Betrieb
- Ã„nderungen am SLO in `slo-recording-rules.yml` anpassen, Dashboard passt sich an.

## Status & NÃ¤chste Aktion
**Status:** Definitionen und Artefakte bereit.  
**NÃ¤chste Aktion:** Prometheusâ€‘Rules & Alerts anwenden, Dashboard importieren.
