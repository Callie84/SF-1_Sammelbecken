# Suchsystem (Meilisearch)

## Ziel
Volltextsuche über Seeds, Breeder, Preise und Beschreibungen mit Autovervollständigung.

## Architektur
- **Meilisearch** → einfach, schnell, keine Java-Abhängigkeit.
- **Backend-Indexer** (`apps/backend/search.ts`) → synct Daten aus MongoDB.
- **Frontend** nutzt `/api/search?q=...` (Debounce, max 20 Ergebnisse).
- **K8s**-Service `sf1-search:7700` (Auth-Key aus Secret `sf1-secrets.SEARCH_KEY`).

## Indexe
| Index | Inhalt | Aktualisierung |
|--------|---------|----------------|
| `seeds` | Name, Breeder, THC/CBD, Blütezeit | täglich |
| `prices` | Host, Preis, URL | alle 3 h |
| `breeders` | Breeder-Profile | wöchentlich |

## Sicherheit
- Kein anonymer Schreibzugriff (`SEARCH_KEY` Pflicht).
- Read-only API-Key fürs Frontend.
- Admin-Key nur im Backend, nicht im Image.

## Risiken & Mitigation
- **Daten veraltet** → CronJob `sync-search`.
- **Fehlerhafte Indexe** → Neuaufbau mit `/scripts/reindex.ps1`.
- **Überlastung** → Rate-Limit im Backend aktiv.

**Stand:** 2025-10-17
