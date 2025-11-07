# SF-1 — Monitoring & Alerting (Stand: 2025-11-01)

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
- Empfänger siehe: `docs/alerting-receivers.md` und `docs/alerts-receivers.md`
- Ziel: Ausfälle von backend, price-service, scraper und backup melden

## 5. Überwachte SF-1-Dienste
- Backend: `k8s/backend.yaml`
- Frontend: `k8s/frontend.yaml`
- Price-Service: `k8s/price-service.yaml`
- Scraper: alle `k8s/scraper/*`
- Backup-Jobs: `k8s/backup/*`
- Analytics/Plausible: `k8s/analytics/*` (optional)

## 6. Nächste Aktion
- Alert-Empfänger mit realen Mails/Webhooks ergänzen
- Grafana-URL im Projekt-Doku festhalten
