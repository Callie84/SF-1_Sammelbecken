# WAF/CDN & Rateâ€‘Limiting

## Ziele
- **Rateâ€‘Limit** pro IP/Route, um Scraper/Bruteforce zu bremsen.
- **Securityâ€‘Header** fÃ¼r Browserâ€‘Schutz.
- **CDN/WAF** (Cloudflare) vorschalten: DDoSâ€‘Schutz, Botâ€‘Score, Geoâ€‘Regeln.

## Komponenten
- **Caddy Ingress Controller** mit angehÃ¤ngter Caddyfile aus ConfigMap.
- **Cloudflare (optional)**: Proxy (orange cloud), Firewallâ€‘Regeln via API.

## Default Limits (Startwerte)
- Public API `GET /api/*`: 120 Req/Min pro IP.
- Login `POST /auth/login`: 10 Req/Min pro IP.
- Journal CRUD: 60 Req/Min pro IP.
- Static Assets: kein Limit, nur CDNâ€‘Cache.

## Securityâ€‘Header
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Content-Security-Policy` (minimal, spÃ¤ter feintunen)

## Cloudflare (optional)
- **Page Rule**: Cache Everything fÃ¼r `/assets/*`.
- **Firewall Rules**:
  - Block bekannte Bad Bots.
  - Challenge bei `cf.client.bot=false` und hoher Requestâ€‘Rate.
  - Geoâ€‘Block/Challenge fÃ¼r LÃ¤nder nach Bedarf.

## Betrieb
- Limits beobachten (Prometheus Metriken/Logs). Zu â€žengâ€œ â†’ erhÃ¶hen. Abuse â†’ senken.

## Risiken & Mitigation
- **False Positives**: Whitelist fÃ¼r Adminâ€‘IPs/CI. Loginâ€‘Limit moderat halten.
- **CSP BrÃ¼che**: CSP iterativ an Frontend anpassen.
- **CDN Bypass**: Erzwinge HTTPS + Proxy nur Ã¼ber Cloudflare (Firewall auf Originâ€‘IP einschrÃ¤nken â€“ spÃ¤terer Schritt).

## Status & NÃ¤chste Aktion
**Status:** Artefakte bereit.  
**NÃ¤chste Aktion:** ConfigMap anwenden, Ingress anpassen, optional Cloudflareâ€‘Regeln einstellen.