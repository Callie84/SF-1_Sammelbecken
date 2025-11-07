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