# SF-1 � Security & Secrets (Template) (Stand: 2025-11-01)

## 1. Grundsatz
- Keine echten Secrets im Git-Repo.
- Secrets immer �ber Kubernetes-Secrets, **SealedSecrets** oder CI-Secret einspielen.
- GPTs d�rfen Secret-NAMEN verwenden, aber niemals Werte ausgeben.

## 2. App-relevante Secrets
| Name          | Zweck                                   | Verwendet in                           |
|---------------|-----------------------------------------|-----------------------------------------|
| MONGO_URI     | Verbindung zur MongoDB                  | apps/backend/, apps/price-service/      |
| JWT_SECRET    | Signierung von JWT f�r Auth             | apps/backend/src/routes/auth.ts         |
| AFFILIATE_KEY | Tracking/Partnerdaten f�r Affiliate     | apps/backend/src/routes/affiliate.ts    |
| ANALYTICS_KEY | Analytics/Plausible                     | apps/backend/src/routes/analytics.ts    |

## 3. Kubernetes-/Cluster-Secrets
Diese Dateien/Manifeste existieren, enthalten aber keine echten Werte:
- `k8s/secrets.yaml`
- `k8s/secrets/rotation_policy.md`
- `k8s/secrets/sealedsecret-api.yml`
- `k8s/secrets/sealedsecret-s3.yml`
- `k8s/secrets/sealedsecret-alerts.yml`

**Regel:** In Doku nur referenzieren, nicht bef�llen.

## 4. Backup-/S3-Secrets (aus k8s/backup/)
- `k8s/backup/10-secret-s3.yaml` ? Zugang zu S3/Bucket
- `k8s/backup/11-secret-mongo.yaml` ? Zugang f�r Mongo-Dumps
- `k8s/backup/12-secret-rsync.yaml` ? Zugang f�r Datei-Sync
Diese drei d�rfen **nie** mit Klartext im Repo oder in GPT-Antworten stehen.

## 5. Rotation
- Vorgaben stehen in: `docs/secrets_rotation.md`
- Ziel: Rotation mindestens 1� pro Quartal
- SealedSecrets bevorzugen, wenn Keys verteilt werden m�ssen

## 6. Vorgaben f�r GPTs
- Wenn YAML generiert wird: Platzhalter wie `<set-via-sealedsecret>` verwenden.
- Wenn PowerShell generiert wird: nur zeigen, **wo** das Secret eingespielt wird, nicht den Wert.
- Keine Beispiel-Passw�rter, keine Tokens, keine realen URLs mit Token.

## 7. N�chste Aktion
- Aktuelle Secret-Namen aus dem laufenden Cluster auslesen
- Liste oben erweitern
# DSGVO â€“ SeedFinder PRO

## Datenarten
- Konto: Eâ€‘Mail, Passwortâ€‘Hash, Rollen, Favoriten
- Nutzungsdaten: Eventâ€‘Aggregationen (anonymisiert), keine PII
- Inhalte: Journalâ€‘EintrÃ¤ge der Nutzer (freiwillig)

## Rechtsgrundlage
- Art. 6 Abs. 1 lit. b DSGVO (VertragserfÃ¼llung, Nutzerkonto)
- Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Betrieb/Analytics ohne PII)

## Speicherfristen
- Kontodaten bis LÃ¶schung; Journal-Inhalte bis Nutzer lÃ¶scht
- Logs max. 30 Tage, IPs anonymisiert/gehasted

## Betroffenenrechte
- Auskunft, Berichtigung, LÃ¶schung, EinschrÃ¤nkung, DatenÃ¼bertragbarkeit, Widerspruch
- Export: `/api/user/export` liefert JSON
- LÃ¶schung: `/api/user` (Softâ†’Hard nach 30 Tagen)

## Auftragsverarbeiter
- Netcup (Hosting), ggf. Eâ€‘Mailâ€‘Provider, optional CDN

## Sicherheit
- TLS, Ruhende Daten: PasswÃ¶rter Argon2id; Secrets in K8s
- Zugriff: Rollenmodell; Protokollierung ohne PII
# Rechtliche Mindestanforderungen (DE)

- Impressum mit Name, Anschrift, Eâ€‘Mail, ggf. Telefon, UStâ€‘IdNr. (falls vorhanden).
- DatenschutzerklÃ¤rung mit Zwecken, Rechtsgrundlagen, Speicherfristen, EmpfÃ¤ngern, Rechten.
- Keine Drittâ€‘Tracker ohne Consent. Plausible selfâ€‘hosted ohne Cookies ist zulÃ¤ssig (keine Einwilligung nÃ¶tig), Banner nicht erforderlich.
- Externe Affiliateâ€‘Links: rel="nofollow noopener noreferrer".
- Jugendschutz: Zielgruppe 18+. Keine Anleitung zu illegalen Handlungen in Verbotszonen.
- HTTPS zwingend, HSTS aktiviert.
# Secretsâ€‘Management (Sealed Secrets)

## Zweck
Secrets sollen im **Gitâ€‘Repo versioniert** werden kÃ¶nnen, **ohne** geheime Inhalte im Klartext. Mit **Sealed Secrets** werden aus normalen Kubernetesâ€‘Secrets **verschlÃ¼sselte** CRs (`SealedSecret`) erzeugt, die nur der Controller im Cluster entschlÃ¼sseln kann.

## Begriffe
- **Secret**: Kubernetesâ€‘Objekt mit sensiblen Werten (Base64, nicht verschlÃ¼sselt).
- **SealedSecret**: VerschlÃ¼sselte Form. Sicher fÃ¼r Git.
- **Sealing Key**: Clusterâ€‘Privatkey. VerlÃ¤sst den Cluster nicht.

## Vorgehen (Ãœbersicht)
1. Lokales Secret als YAML vorbereiten (ohne Commit).
2. Mit dem **Ã¶ffentlichen Zertifikat** des Controllers verschlÃ¼sseln â†’ `SealedSecret`.
3. **Nur** `SealedSecret` ins Repo committen.
4. Im Cluster stellt der Controller daraus das normale `Secret` bereit.

## Geltungsbereich
- APIâ€‘Credentials (DB, JWT, SMTP),
- S3/Backupâ€‘ZugÃ¤nge,
- Alertmanagerâ€‘EmpfÃ¤nger (Eâ€‘Mail, Slack),
- Blackbox Basicâ€‘Auth, etc.

## Rotation
- Alten Wert im Cluster Ã¤ndern â†’ neues `SealedSecret` erzeugen â†’ committen â†’ deployen.

## Risiken & Mitigation
- **Keyverlust** des Controllers: RegelmÃ¤ÃŸiges Controllerâ€‘Keyâ€‘Backup (Clusterâ€‘Admin).
- **Falscher Namespace/Name**: Beim Sealen **Namespace** und **Name** exakt setzen.
- **KompatibilitÃ¤t**: `kubeseal` Version passend zum Controller verwenden.

## Status & NÃ¤chste Aktion
**Status:** Artefakte vorhanden.  
**NÃ¤chste Aktion:** Zertifikat vom Controller holen, lokale Secrets versiegeln, `SealedSecret`â€‘YAMLs committen.
# Secrets-Rotation für SF-1

Ziel: Regelmäßige, nachvollziehbare Rotation aller sensitiven Schlüssel ohne Downtime. Sealed Secrets bleiben Standard.

## Geltungsbereich (Inventar)
| Schlüssel | Zweck | Ort in K8s | Rotationsintervall |
|---|---|---|---|
| MONGO_PASS | DB-User-Passwort | secret `mongo-auth` | 90 Tage |
| JWT_SECRET | Token-Signatur | secret `api-auth` | 90 Tage |
| COOKIE_SECRET | Session/CSRF | secret `api-auth` | 90 Tage |
| S3_ACCESS_KEY | Backup-Access | secret `backup-s3` | 180 Tage |
| S3_SECRET_KEY | Backup-Secret | secret `backup-s3` | 180 Tage |
| SMTP_PASS | Outbound-Mail | secret `smtp-auth` | 180 Tage |
| ALERT_SMTP_PASS | Alertmanager | secret `alertmanager-smtp` | 180 Tage |
| OAUTH_GITHUB_SECRET | Login OAuth | secret `oauth-github` | 180 Tage |
| SESSION_KEY | Server-Session | secret `api-auth` | 90 Tage |

## Grundsätze
- Kein Klartext im Repo. **Nur** versiegelte Manifeste (Sealed Secrets) committen.
- Rotation = **Erzeugen → Prüfen → Versiegeln → Deploy → Verifizieren**.
- Rollback: Vorherige SealedSecret-Manifeste behalten; Versionen in Git.

## Ablauf (Übersicht)
1. **Lokal generieren**: neue Werte mit `scripts/rotate_secrets.ps1` erzeugen (legt Dateien unter `k8s\secrets\pending\` ab).  
2. **Prüfen**: Längen/Alphabet/Entropie in der JSON und Fingerprints kontrollieren.  
3. **Versiegeln**: mit `kubeseal` aus Pending-YAML → `k8s\secrets\sealed\*.yaml`.  
4. **Review & Merge**: PR nur mit versiegelten Dateien.  
5. **Deploy**: `kubectl apply -f k8s/secrets/sealed/` (Dokumentation; nicht hier ausführen).  
6. **Verifizieren**: App-Health, Login, Backups, Alerts.  
7. **Bereinigen**: `k8s\secrets\pending\` lokal löschen.

## Tests nach Rotation (Checkliste)
- `/api/health` → 200 OK  
- Neue Logins (JWT/Session) funktionieren  
- Backups laufen (S3 Credentials ok)  
- Alertmanager sendet Testmail  
- MongoDB-Auth greift

## Risiken & Mitigation
- **Alte Pods mit alten Secrets** → Inkonsistenz.  
  *Mitigation*: nach Apply gezielt Rollout von Deployments/StatefulSets.
- **Plaintext-Leak im Repo**.  
  *Mitigation*: Pending-Verzeichnis im `.gitignore` (siehe unten), nur `sealed/` commiten.
- **Fehlender kubeseal-Key**.  
  *Mitigation*: Cluster-Backup der Sealed-Secrets-Keys vorhanden halten; ohne Key ist Entschlüsselung im Cluster unmöglich.

## .gitignore-Ergänzung (nur Beispiel, ins Repo aufnehmen)
# Auth/RBAC fÃ¼rs Journal

## Ziele
- **Login** mit Eâ€‘Mail/Passwort â†’ JWT (HS256) mit `sub`, `roles` und `exp`.
- **RBAC**: Rollen `user`, `editor`, `admin`.
- **EigentÃ¼merâ€‘Check**: Schreibzugriff auf Journalâ€‘EintrÃ¤ge nur durch Besitzer, auÃŸer `editor`/`admin`.

## Token
- Signatur: HS256 mit `JWT_SECRET` (aus K8s Secret `api-secrets`).
- Claims: `{ sub: userId, roles: string[], iat, exp }`.
- Ãœbertragung: Header `Authorization: Bearer <jwt>`.

## Endpunkte
- `POST /auth/login` â†’ `{ token }`.
- `GET /journal` (listet nur eigene, auÃŸer `editor`/`admin`).
- `POST /journal` (owner = `sub`).
- `PUT /journal/:id`, `DELETE /journal/:id` (owner oder Rolle `editor`/`admin`).

## Sicherheit
- Passwortâ€‘Hashes per `bcryptjs` (12 Runden).
- Rateâ€‘Limit wird separat im WAFâ€‘Block behandelt.

## Status & NÃ¤chste Aktion
**Status:** Artefakte und Middleware bereit.  
**NÃ¤chste Aktion:** `.env`/K8sâ€‘Secret `JWT_SECRET` setzen, Routen an App mounten, minimalen Adminâ€‘User anlegen.
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
# Supply-Chain Security für SF-1

Ziel: Manipulation an Code, Builds und Images verhindern bzw. schnell entdecken. Fokus: reproduzierbare Builds, nachvollziehbare Images, SBOM & Signaturen, strenge Admission-Policies.

## Maßnahmen (Überblick)
1. **SBOM pro Image** (SPDX) automatisch erzeugen und als **OCI-Attestation** anhängen.
2. **Keyless Signaturen mit Cosign** aus GitHub Actions (OIDC).
3. **Kyverno-Policies**: 
   - Keine `:latest`-Tags.
   - Nur Registry **ghcr.io** und Org **${OWNER}**.
   - Basis-Hardening (runAsNonRoot, readOnlyRootFilesystem).
4. **Review-Pflicht**: Änderungen an `k8s/*` nur via Pull Request.
5. **Release-Tags**: semantische Versionen; `stable` nur durch Release-Workflow.

## Build-Pipeline (vereinfacht)
- Docker Build & Push → `ghcr.io/<owner>/sf1-frontend` und `.../sf1-backend`.
- SBOM erzeugen (Syft) → `*.spdx.json`.
- Cosign Attestation (`--type spdx`) an das Image anhängen (keyless, OIDC).
- Artefakte archivieren (SBOM + Build-Logs).

## Kyverno Admission
- Verhindert Deployments mit `:latest`.
- Erzwingt Registry `ghcr.io/<owner>/*`.
- Erzwingt SecurityContext: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`.

## Risiken & Mitigation
- **Fehlende Metriken/CRDs** → Policies greifen nicht: Kyverno/metrics prüfen.
- **Private Repos/Images** → GHCR Login nötig: ImagePullSecret hinterlegen.
- **Canary/Blue-Green mismatch** → Policies blockieren falsche Tags. Lösung: gleiche Regeln für alle Farb-Deployments.

## Validierung (nur Lesen)
- SBOM vorhanden: `cosign verify-attestation --type spdx ghcr.io/<owner>/sf1-backend:stable`
- Kyverno aktiv: `kubectl get cpol`
- Policy-Treffer: `kubectl get events -A | findstr Denied` (Windows) / `grep` (Linux)

**Stand:** 2025-10-17
# Risiken & GegenmaÃŸnahmen

## Infrastruktur
- Singleâ€‘Node Ausfall â†’ tÃ¤gliche Dumps, wÃ¶chentlich Offâ€‘Site, Restoreâ€‘Test monatlich
- Zertifikatsfehler â†’ cert-manager Events prÃ¼fen, DNS/HTTPâ€‘01 Pfad korrekt, Fallback Stagingâ€‘CA

## Sicherheit
- Secrets in Git â†’ Verboten; nur K8s Secrets, CI via GitHub Secrets
- XSS/CSRF â†’ Helmet, CSP (script-src 'self'), SameSite=Lax Cookies, Zodâ€‘Validation
- Bruteâ€‘Force â†’ Rateâ€‘Limit Login 5/min/IP, Exponential Backoff

## Daten/DB
- Schreibkonflikte â†’ Upsert mit Filter (seedId, seedbank), Idempotente Scraper Writes
- DBâ€‘Wachstum â†’ priceHistory TTL optional, Archivierung

## Scraper
- 403/429 â†’ Rate erhÃ¶hen, Backoff, Adapter pausieren, Kontakt Partner
- DOMâ€‘Ã„nderungen â†’ Selectorâ€‘Map versionieren, 0â€‘Treffer Alert, schnelle Patchâ€‘Pipeline

## Kosten/Bandbreite
- Peak Traffic â†’ statische Assets cachen, Bildkompression, spÃ¤ter CDN
- Storage â†’ BildgrÃ¶ÃŸenlimit, WebP, automatische Komprimierung

## Recht/Compliance
- DSGVO â†’ Datensparsamkeit, Export/Delete, Impressum/Datenschutz sichtbar
- robots.txt â†’ respektieren; keine Captchaâ€‘Umgehung
