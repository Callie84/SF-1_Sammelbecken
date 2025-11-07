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