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