# SF-1 � Frontend-Struktur (Stand: 2025-11-01)

## 1. Ziel
Alle neuen React/TSX-Dateien f�r SF-1 sollen an der gleichen Stelle liegen und die gleichen Regeln nutzen, damit verschiedene GPTs nicht durcheinander speichern.

## 2. Basis-Pfade
- App-Root: `apps/frontend/`
- Source: `apps/frontend/src/`
- **Pages (Routenseiten):** `apps/frontend/src/pages/`
- **Components (wiederverwendbar):** `apps/frontend/src/components/`
- **Layouts / Shell:** `apps/frontend/src/layouts/`
- **Lib / Utils / Hooks:** `apps/frontend/src/lib/` oder `apps/frontend/src/utils/`
- **API-Client:** `apps/frontend/src/api/`

## 3. Typische SF-1-Seiten
- `apps/frontend/src/pages/Home.tsx` ? Start / Dashboard
- `apps/frontend/src/pages/Seeds.tsx` ? Seed-/Sortenliste
- `apps/frontend/src/pages/Prices.tsx` ? Preis-/Shop-Vergleich
- `apps/frontend/src/pages/UGG.tsx` ? Anzeige des Ultimate Grow Guide (UGG-1)
- `apps/frontend/src/pages/Account.tsx` ? Profil, Favoriten, Premium
- `apps/frontend/src/pages/Admin.tsx` ? interne Tools (nur f�r Rollen, siehe Backend)

## 4. Komponenten-Struktur
- `apps/frontend/src/components/ui/` ? Buttons, Cards, Badges, Modals
- `apps/frontend/src/components/lists/` ? Tabellen, Listen, Ergebnis-Listen
- `apps/frontend/src/components/forms/` ? Filter, Suchfelder, Formulare
- `apps/frontend/src/components/ads/` ? Banner, Affiliate-Boxen (max. 10 % Fl�che)

## 5. Regeln f�r neue Komponenten
- **Keine Inline-Styles.**
- **Kein `any`.** Typen sauber definieren.
- **Nur vorhandene Utility-/Design-Klassen nutzen** (kein externes CDN).
- **Pfad immer mitliefern** (�Datei speichern unter: ��).
- **Keine API-Calls direkt in Pages**, sondern �ber `apps/frontend/src/api/` oder Services.

## 6. Bezug zu UX / i18n / Bilder
- Barrierefreiheit: siehe `docs/accessibility.md`
- Mehrsprachigkeit: siehe `docs/i18n.md`
- Bilder / Optimierung: siehe `docs/image_pipeline.md`
- Link-Struktur: siehe `docs/link-map.md`

## 7. N�chste Aktion
- Beim Erstellen neuer GPTs f�r Frontend immer diesen Pfad angeben.
- Alte Kurzfassung durch dieses Dokument ersetzen.
# Accessibility (WCAG 2.2 AA)


## Grundsätze
- Tastatur: Alles per Tab/Enter/Esc bedienbar.
- Fokus: Sichtbarer Fokus, keine Focus-Traps.
- Kontrast: >= 4.5:1 (Text), >= 3:1 (UI‑Grafiken).
- Struktur: Landmarks, Überschriften‑Hierarchie, Labels.
- Medien: Alternativtexte, Untertitel.
- Bewegung: Respektiere `prefers-reduced-motion`.


## Landmarks
- `<header>`, `<nav aria-label="Hauptnavigation">`, `<main id="main" tabindex="-1">`, `<footer>`.
- Skip‑Link zu `#main`.


## Kontrast‑Regeln
- Farben nur aus Theme‑Token verwenden.
- Kontrasttests in `a11y.spec.ts`.


## Interaktive Elemente
- Buttons statt `div` mit `onClick`.
- Links nur für Navigation; `rel="nofollow sponsored"` bei Affiliate.
- `aria-disabled` und echte `disabled` verwenden.


## Formulare
- `label for`/`id` oder `aria-label`.
- Fehlermeldungen mit `aria-live="polite"`.


## Modal/Dialog
- Fokus beim Öffnen in Dialog setzen, beim Schließen zurück.
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.


## Tastenkürzel
- `Escape` schließt Modals, `Tab` zyklisch im Dialog.


## Reduzierte Bewegung
- Animationszeit → 0 bei `prefers-reduced-motion: reduce`.


## Tests
- Playwright + `@axe-core/playwright` gegen UI‑Routen.
- Lint: `eslint-plugin-jsx-a11y` (empfohlen).


## Definition of Done
- Keine `axe`‑Violations in kritischen Views (Home, Suche, Seed‑Detail, Journal).
- Manuelle Tastatur‑Checks bestanden.
# i18n (Internationalisierung)


## Ziele
- ICU-Nachrichten, Zahlen/Datum/Währung pro Locale.
- Sprachwechsel ohne Reload, Persistenz in `localStorage`.
- SEO: `hreflang`-Links pro Route.


## Locales
- Primär: `de` (Standard), Sekundär: `en`.


## Erkennung
- Reihenfolge: URL-Param `?lang=` → `localStorage.sf1_lang` → Browser → Fallback `de`.


## Namespaces
- `common` (UI, Navigation, Fehlermeldungen).


## Consent & i18n
- i18n speichert **nur** `sf1_lang` (notwendig, kein Tracking).


## Definition of Done
- Keine fehlenden Keys laut `i18n-verify.ps1`.
- E2E-Tests zeigen umgeschaltete Texte und formatiertes Datum/Währung.
# Bild-Pipeline & CDN

## Ziel
Bilder sicher speichern, verlustarm ausliefern, automatisch skalieren, mit Cache-Headern für CDN.

## Quellen
- **GridFS** (User-Journal) – Standard.
- **S3-kompatibel** (optional) – für Off-Site/Backups.

## Endpunkt
`GET /img/:id?w=..&h=..&q=..&fmt=webp|jpeg|png&fit=cover|contain&sig=HMAC`

## Limits & Sicherheit
- Max: `w,h <= 3000`. Quality `q 30–95`.
- Nur `webp|jpeg|png`.
- **Signatur (HMAC-SHA256)** mit `IMG_SECRET`. Anfrage ohne gültige `sig` → 403.
- Alle Antworten mit Cache-Headern:
  - `Cache-Control: public, max-age=31536000, immutable` (bei unveränderlichen IDs)
  - `ETag` und `Last-Modified`.

## Speicherwahl
- Env `IMAGE_STORE=gridfs|s3`. Default `gridfs`.
- S3 braucht: `S3_ENDPOINT,S3_BUCKET,S3_REGION,S3_ACCESS_KEY,S3_SECRET_KEY`.

## CDN
- Subdomain **img.seedfinderpro.de** zeigt auf `/img/*`.
- CDN/Proxy darf unbegrenzt cachen (wegen `immutable` + ID-basiertem Pfad).

## Fehlerfälle
- Quelle fehlt → 404.
- Param-Fehler → 400.
- Verarbeitung schlägt fehl → 500 (mit Log).

**Stand:** 2025-10-17
# Linkâ€‘Map (Docs)

Diese Ãœbersicht wird von `/scripts/docs-backlinks.ps1` erzeugt. Sie zeigt pro Datei die erkannten Ãœberschriftenâ€‘Anker und die â€žSiehe auchâ€œâ€‘Ziele.

> Hinweis: Dateien auÃŸerhalb von `/docs` werden ignoriert.

| Datei | Ãœberschriften (Anker) | Siehe auch |
|---|---|---|
| _wird vom Skript Ã¼berschrieben_ | | |

## Status & NÃ¤chste Aktion
**Status:** Platzhalterâ€‘Tabelle initial.  
**NÃ¤chste Aktion:** Skript ausfÃ¼hren, damit die Tabelle mit echten Werten gefÃ¼llt wird (spÃ¤ter, nicht jetzt).
