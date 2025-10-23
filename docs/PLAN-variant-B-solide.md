# SFâ€‘1 â€“ Variante B (Solide, empfohlen)

## Ziel
Produktionsbetrieb auf Netcup RS1000 SE. k3s Singleâ€‘Node, Traefik, certâ€‘manager, MongoDB als StatefulSet, CI/CD.

## Kosten
~15 â‚¬/Monat (Server+Domain+kleiner Offâ€‘Siteâ€‘Storage).

## Komponenten
- Orchestrierung: k3s (Traefik Ingress)
- TLS: certâ€‘manager + Letâ€™s Encrypt
- DB: MongoDB 6 StatefulSet + tÃ¤gliche Backups
- Backend: Node 20 + Express + Zod + JWT
- Frontend: React + Tailwind + PWA
- Scraper: Playwright + K8s CronJobs (4Ã—/Tag)
- Analytics: Plausible selfâ€‘hosted (optional Phase 2)
- CI/CD: GitHub Actions â†’ GHCR â†’ kubectl rollout

## Reihenfolge (DoD)
1) Server hÃ¤rten, k3s installieren. **DoD:** `kubectl get nodes` ok, UFW an.
2) certâ€‘manager + ClusterIssuer. **DoD:** Testâ€‘Certificate erstellt.
3) Mongo deploy + Benutzer + Indexe. **DoD:** `mongosh` Login, Collections+Index da.
4) Backend API deploy (api.seedfinderpro.de). **DoD:** 200 OK auf `/health`.
5) Frontend PWA deploy (seedfinderpro.de). **DoD:** Lighthouse PWA â‰¥ 90.
6) Scraper v1 (2 Seedbanks), CronJobs. **DoD:** 4Ã—/Tag, Fehlerrate <5%.
7) Auth v1 (Register/Login/Favs). **DoD:** JWT, Refresh, DSGVO Export/Delete.
8) Affiliate Redirect `/go/:partner/:slug`. **DoD:** KlickzÃ¤hlung, UTM.
9) Analytics. **DoD:** Topâ€‘Flows sichtbar.
10) Android TWA. **DoD:** Internal Testing bereit.

## Risiken & Mitigation
- Singleâ€‘Node: Bei Hostâ€‘Ausfall Down â†’ tÃ¤gliche Dumps + Offâ€‘Site Sync.
- Trafficâ€‘Spitzen: Traefik Rateâ€‘Limit + Cache, CDN spÃ¤ter.
- Scraper DOMâ€‘Ã„nderungen: Selectorâ€‘Versionen, Alerts bei 0 Treffern.