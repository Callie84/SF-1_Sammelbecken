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
