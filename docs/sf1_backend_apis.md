# SF-1 — Backend-APIs (Stand: 2025-11-01)

Quelle: apps/backend/src/routes/*.ts

| Route           | Methode(n)     | Auth | Datei                             | Beschreibung                                  |
|-----------------|----------------|------|------------------------------------|-----------------------------------------------|
| /api/prices     | GET            | nein | src/routes/prices.ts              | Preise/Seeds aus dem price-service abrufen    |
| /api/ugg        | GET            | nein | src/routes/ugg.ts                 | UGG-1 Inhalte ausliefern                      |
| /api/auth       | POST, GET      | nein | src/routes/auth.ts                | Login, Token, evtl. Refresh                   |
| /api/affiliate  | GET            | nein | src/routes/affiliate.ts           | Affiliate-/Partnerdaten für Monetarisierung   |
| /api/analytics  | GET            | ja?  | src/routes/analytics.ts           | Analytics/Plausible-Daten                     |
| /api/journal    | GET, POST      | ja   | src/routes/journal.ts             | Projekt-/Grow-Journal-Einträge                 |
| /api/tools      | GET            | nein | src/routes/tools.ts               | Tools/Rechner (z. B. DLI, Strom, Formeln)     |
| /api/image      | POST           | ja?  | apps/backend/imageHandler.ts      | Upload/Verarbeitung von Bildern               |
| /api/search     | GET            | nein | apps/backend/search.ts            | Suche über Seeds/Content                       |

**Offen:**
- „ja?“ in Code klären.
- Response-Schemas ergänzen.
