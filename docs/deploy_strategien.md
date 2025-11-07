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
