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
