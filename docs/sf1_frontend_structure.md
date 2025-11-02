# SF-1 — Frontend-Struktur (Stand: 2025-11-01)

## 1. Ziel
Alle neuen React/TSX-Dateien für SF-1 sollen an der gleichen Stelle liegen und die gleichen Regeln nutzen, damit verschiedene GPTs nicht durcheinander speichern.

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
- `apps/frontend/src/pages/Admin.tsx` ? interne Tools (nur für Rollen, siehe Backend)

## 4. Komponenten-Struktur
- `apps/frontend/src/components/ui/` ? Buttons, Cards, Badges, Modals
- `apps/frontend/src/components/lists/` ? Tabellen, Listen, Ergebnis-Listen
- `apps/frontend/src/components/forms/` ? Filter, Suchfelder, Formulare
- `apps/frontend/src/components/ads/` ? Banner, Affiliate-Boxen (max. 10 % Fläche)

## 5. Regeln für neue Komponenten
- **Keine Inline-Styles.**
- **Kein `any`.** Typen sauber definieren.
- **Nur vorhandene Utility-/Design-Klassen nutzen** (kein externes CDN).
- **Pfad immer mitliefern** („Datei speichern unter: …“).
- **Keine API-Calls direkt in Pages**, sondern über `apps/frontend/src/api/` oder Services.

## 6. Bezug zu UX / i18n / Bilder
- Barrierefreiheit: siehe `docs/accessibility.md`
- Mehrsprachigkeit: siehe `docs/i18n.md`
- Bilder / Optimierung: siehe `docs/image_pipeline.md`
- Link-Struktur: siehe `docs/link-map.md`

## 7. Nächste Aktion
- Beim Erstellen neuer GPTs für Frontend immer diesen Pfad angeben.
- Alte Kurzfassung durch dieses Dokument ersetzen.
