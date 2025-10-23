# API Reference

**Base URL:** `https://seedfinderpro.de/api`

| Endpoint | Methode | Beschreibung |
|-----------|----------|---------------|
| `/health` | GET | Statusâ€‘CheckÂ â†’ `{ status: "ok" }` |
| `/seeds` | GET | Liste aller Seeds mit Preisvergleich |
| `/seed/:id` | GET | Detailansicht eines Seeds |
| `/user/login` | POST | JWTâ€‘basierte Authentifizierung |
| `/user/register` | POST | Neuen Benutzer anlegen |
| `/favorites` | GET/POST/DELETE | Favoriten verwalten |

**Responseâ€‘Beispiel:**