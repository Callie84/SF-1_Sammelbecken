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
