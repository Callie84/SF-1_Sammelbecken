# SF-1 � Kubernetes Deploy (Stand: 2025-11-01)

## 1. Basis-Reihenfolge
1. k8s/secrets.yaml
2. k8s/mongo.yaml
3. k8s/backend.yaml
4. k8s/price-service.yaml
5. k8s/frontend.yaml
6. k8s/ingress-caddy.yaml

## 2. Erweiterungen (direkt im Root von k8s\)
- k8s/autoscaling.yaml
- k8s/cdn.yaml
- k8s/cert-issuer.yaml
- k8s/gateway.yaml
- k8s/search.yaml
- k8s/redis.yaml
- k8s/mongo-backup.yaml
- k8s/scraper-rqs.yaml
- k8s/scraper-zamnesia.yaml

## 3. Ordner-Struktur (Themen-Namespaces)
- k8s/analytics/* (namespace.yaml, plausible.yaml, clickhouse.yaml, ingress.yaml �)
- k8s/backup/* (00-namespace.yaml, 01-backup-pvc.yaml, CronJobs f�r mongodump/kubedump/rsync)
- k8s/monitoring/* (Prometheus, Loki, Grafana, Alertmanager, SLO-Rules)
- k8s/testing/* (00-namespace.yaml, smoke-CronJob)
- k8s/security/* (NetworkPolicies, Header, Labels)
- k8s/scraper/* (Config, Deployment-Worker, HPA, Service-Monitor)
- k8s/policies/* (supply-chain.yaml)
- k8s/restore-drill/* (cronjob.yml)

## 4. Vorgaben
- ingressClassName: caddy
- domain: seedfinderpro.de
- namespaces: default, monitoring, backup, testing
- Secrets nicht im Klartext committen ? k8s/secrets/*.yaml oder sealedsecret-*.yml

## 5. Apply-Hinweis
- Erst Root-Basis (Punkt 1)
- Dann thematische Ordner (analytics, monitoring, backup, security)
- Zuletzt ingress
# Kubernetes Deployment

Cluster: Debianâ€‘basierte Nodes aufÂ Netcup, K8sÂ v1.30.  
Namespace: `default`

## Voraussetzungen
- `kubectl` + `helm` installiert
- `kubeconfig` liegt in `~/.kube/config`

## Deploy
# Server Setup (DebianÂ 12)

## SSH
# Lokales Setup

## Voraussetzungen
- Node.jsÂ â‰¥Â 20
- npmÂ â‰¥Â 10
- MongoDB lokal oder Atlas
- Git + PowerShell

## Installation
# SF-1 Autoscaling (HPA + VPA)

## Zweck
- **HPA** skaliert die Replikas der Deployments `sf1-backend` und `sf1-frontend` anhand von CPU- und RAM-Auslastung.
- **VPA** liefert **Empfehlungen** für Requests/Limits (updateMode=Off). Keine Live-Änderungen.

## Dateien
- Manifest: `/k8s/autoscaling.yaml`
- Zugehörige Deployments (vorausgesetzt): `apps/v1 Deployment sf1-backend`, `sf1-frontend` im Namespace `default`.

## Voraussetzungen
- metrics-server im Cluster aktiv (für CPU/RAM).
- Deployments besitzen **requests** und **limits**. Ohne `resources.requests` funktioniert **Resource-Utilization** im HPA nicht sinnvoll.
- VPA-Komponenten installiert (nur für Empfehlungen nötig).

## Wirkprinzip (kurz)
- **Backend-HPA**: Ziel CPU 60 %, RAM 70 %, 2–8 Replikas. Ruhige Scale-Down-Phase (5 min Stabilisierung).
- **Frontend-HPA**: Ziel CPU 50 %, RAM 65 %, 2–6 Replikas.
- **PDBs** verhindern, dass alle Pods gleichzeitig evicted werden.
- **VPA** gibt Ober-/Untergrenzen vor (min/maxAllowed), Update **aus**.

## Risiken & Mitigation
- **Kein metrics-server** → HPA bleibt statisch.  
  *Mitigation:* metrics-server bereitstellen.
- **Fehlende requests** → HPA-Ziele sinnlos.  
  *Mitigation:* In Deployments `resources.requests` definieren (z. B. Backend: `cpu: 300m`, `memory: 600Mi`).
- **Zu aggressives Scaling** → Flapping.  
  *Mitigation:* Bereits eingebaut: Stabilization und Policies; Schwellwerte nur vorsichtig ändern.
- **VPA + HPA auf gleicher Ressource** → Konflikt möglich, wenn VPA live Ressourcen ändert.  
  *Mitigation:* `updateMode=Off` belassen. Nur Empfehlungen nutzen und manuell ins Deployment übernehmen.

## Validierung (nur Lesen, nichts ausführen)
- Manifeste prüfen: `kubectl kustomize` oder `kubectl apply --dry-run=client -f k8s/autoscaling.yaml`
- Metriken sichten (Grafana/Prometheus-Dashboards).
- VPA-Empfehlung ansehen (wenn VPA-CRDs vorhanden):  
  `kubectl get vpa -n default sf1-backend-vpa -o yaml` (zeigt Empfehlungen im Status-Bereich).

## Pflege
- Schwellenwerte halbjährlich prüfen (Traffic, Scraper-Last, Sale-Events).
- VPA-Empfehlungen regelmäßig in Deployments übernehmen und committen.

**Stand:** 2025-10-17
# Deploy-Strategien: Blue/Green & Canary

## Ziel
Risikoarme Releases. Schnelles Rollback. Getrennte Canary-Tests ohne Einfluss auf den Hauptverkehr.

## Blue/Green (Hauptdomain)
- Zwei gleichwertige Stacks: **blue** und **green**.
- Der Service `sf1-backend`/`sf1-frontend` zeigt via Label-Selector auf **eine** Farbe.
- Umschalten = **nur** den `selector` des Service ändern.

### Umschalten (Dokumentation, nichts ausführen)
- Backend live auf GREEN:
  - Service `sf1-backend.spec.selector` → `{ app: sf1-backend, color: green }`
- Frontend live auf GREEN:
  - Service `sf1-frontend.spec.selector` → `{ app: sf1-frontend, color: green }`

Rollback = zurück auf BLUE.

## Canary (Subdomain)
- Separate Subdomain `canary.seedfinderpro.de`.
- Eigene Deployments/Services mit Tag `:canary`.
- Nur Tester bekommen den Link. Kein Prozent-Splitting nötig.

> Hinweis: Gewichtetem Routing (Prozent) würde ein Mesh (z. B. Istio/Linkerd) oder ein spezieller Ingress-Controller mit Traffic-Splitting bedürfen. Für KISS nutzen wir Subdomain-Canary.

## Risiken & Mitigation
- **Fehlerhafte Umschaltung** → Downtime.
  - Mitigation: Services *nur* über Pull-Request ändern, Smoke-Test vor Umschalten.
- **Unterschiedliche Configs** zwischen Blue/Green.
  - Mitigation: identische Manifeste; Farbe nur als Label.
- **TLS/Host fehlt** für Canary.
  - Mitigation: DNS-Eintrag `canary.seedfinderpro.de → Ingress-IP` setzen. Cert-Manager stellt Zertifikat aus.

## Validierung (nur Lesekontrollen)
- Blue/Green bereit: `kubectl get deploy -l app=sf1-backend` und `...frontend`
- Aktive Farbe: `kubectl get svc sf1-backend -o jsonpath='{.spec.selector.color}'`
- Health: `https://seedfinderpro.de/api/health` und `https://canary.seedfinderpro.de/api/health`

**Stand:** 2025-10-17
# Troubleshooting

| Problem | Ursache | LÃ¶sung |
|----------|----------|---------|
| Kein Zugriff aufÂ Grafana | Ingress oder DNS falsch | `kubectl describe ingress grafana -n monitoring` |
| Mongoâ€‘Fehler â€žECONNREFUSEDâ€œ | Service nicht gestartet | `kubectl get pods -n default`Â â†’Â Logs prÃ¼fen |
| Backup schlÃ¤gt fehl | S3Â Secret fehlt | `kubectl get secrets -n backup` prÃ¼fen |
| CIÂ â€žpermission deniedâ€œ | GHCRÂ Token unvollstÃ¤ndig | PATÂ mitÂ `write:packages` generieren |
| SmokeÂ CheckÂ fail | HealthÂ Endpoint falsch | `/api/health`Â implementieren |
