# ROADMAP (Variante B â€“ Solide)

## Phase 0 â€“ Vorbereitung (Tag 1)
- Server hÃ¤rten (UFW, Fail2Ban), k3s installieren
- cert-manager + ClusterIssuer deployen
- Repo-Struktur final anlegen (apps/, k8s/, scripts/, docs/, .github/)
**DoD:** `kubectl get nodes` ok, TLS-Testzertifikat ok

## Phase 1 â€“ Datenbank (Tag 2)
- MongoDB StatefulSet + Service + PVC
- Benutzer/DB/Indexe via mongosh
- CronJob Backups 02:00 tÃ¤glich
**DoD:** `mongosh` Login ok, `seeds`, `priceHistory` und Indexe vorhanden, Backup-Artifact erzeugt

## Phase 2 â€“ Backend Core (Tag 3â€“5)
- Express App, Zod-Validation, Helmet, CORs Whitelist
- Endpunkte: /api/prices/today, /api/prices/search, /api/seeds/:id
- Dockerfile, k8s/backend.yaml, Ingress api.seedfinderpro.de
**DoD:** `/health` 200, `/api/prices/today` liefert JSON (Dummy/Daten)

## Phase 3 â€“ Frontend PWA (Tag 6â€“9)
- Next + Tailwind, App Router, Manifest, Service Worker
- Seiten: Suche, Liste, Detail; Settings, Downloads (UGG-1)
- Ingress seedfinderpro.de + www
**DoD:** Lighthouse PWA â‰¥ 90, Suche reagiert <300 ms (mit Cache)

## Phase 4 â€“ Scraper v1 (Tag 10â€“13)
- Playwright Adapter: Zamnesia, RQS
- Normalisierung, Upsert currentPrices, optional priceHistory
- K8s CronJobs 4Ã—/Tag, Backoff + Robots-Check
**DoD:** Fehlerrate <5%, 0â€‘Treffer-Alert

## Phase 5 â€“ Auth v1 (Tag 14â€“17)
- Register/Login/Refresh/Logout; Argon2id
- Favoriten CRUD; Account Delete (Softâ†’Hard 30d)
- DSGVO Export (JSON Download)
**DoD:** JWT Cookies (HttpOnly, Secure), Export/Deletions getestet

## Phase 6 â€“ Tools v1 (Tag 18â€“20)
- Powerâ€‘Cost, DLI, PPFD, Layout (Formeln + Validation)
**DoD:** Unitâ€‘Tests fÃ¼r Formeln grÃ¼n

## Phase 7 â€“ Affiliate/Ads v1 (Tag 21â€“22)
- /go/:partner/:slug Redirect + UTM
- Bannerâ€‘Slots, Frequencyâ€‘Capping (localStorage)
**DoD:** KlickzÃ¤hlung ohne PII

## Phase 8 â€“ Analytics (Tag 23)
- Plausible selfâ€‘hosted, Events fÃ¼r Suche, Detail, /go/*
**DoD:** Dashboards: Topâ€‘Seeds, Funnel (Sucheâ†’Detailâ†’Go)

## Phase 9 â€“ Android TWA (Tag 24)
- Bubblewrap Build, Internal Test Track
**DoD:** Installierbar, Start ohne Whiteâ€‘Screen <2s

## Phase 10 â€“ Monitoring minimal (Tag 25)
- Probes, UptimeRobot, 5xxâ€‘Alert, Podâ€‘Restartâ€‘Alert
**DoD:** Alerts ausgelÃ¶st im Test

## Phase 11 â€“ HÃ¤rtung & Docs (Tag 26)
- CSP/HSTS, Secrets Review, Runbooks fertig, README
**DoD:** Sicherheitscheckliste grÃ¼n
# SFâ€‘1 â€“ Variante A (Lowâ€‘Cost)

## Ziel
Prototyp mit minimalen Fixkosten. Hosting: Vercel Hobby oder kleiner Netcupâ€‘VPS. DB: Supabase Free. Keine K8s.

## Dienste
- Hosting: Vercel Hobby (0 â‚¬) *oder* Netcup VPS 200 G8 (~5 â‚¬)
- DB/Storage/Auth: Supabase Free (0 â‚¬)
- Domain: seedfinderpro.de (~1 â‚¬/Monat, jÃ¤hrl. abgerechnet)
- TLS: Letâ€™s Encrypt (0 â‚¬)
- CI/CD: GitHub Actions (0 â‚¬)

## Architektur
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
# SFâ€‘1 â€“ Variante C (Highâ€‘End)

## Ziel
HAâ€‘fÃ¤hige, skalierbare Infrastruktur ohne Kostendruck. 2Ã— Server, getrennte Rollen, Observabilityâ€‘Stack.

## Komponenten
- k3s HA, Longhorn/Ceph Storage, External LB
- DB: MongoDB Atlas M10 (Multiâ€‘AZ)
- CDN+WAF: Cloudflare Pro
- Observability: Prometheus, Loki, Grafana, Tempo
- Rollouts: Argo Rollouts (Blue/Green, Canary)

## Reihenfolge (DoD)
1) Zwei Nodes + Shared Storage. **DoD:** Pods crossâ€‘node verteilt.
2) Atlas Cluster + Peering. **DoD:** < 10 ms Latenz zur App.
3) CI/CD mit Progressive Delivery. **DoD:** Canary 10%â†’100%.
4) Full Observability + SLOs. **DoD:** 99.9% Monatsâ€‘SLO messbar.

## Risiken & Mitigation
- Kosten â†’ Budgets/Alerts.
- KomplexitÃ¤t â†’ IaC, Runbooks, GameDays.
