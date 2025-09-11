🚀 User Auth – Teil 2:
- /user/me (GET): Eigene Profildaten abrufen
- /user/me (PUT): Eigene Profildaten ändern
- /user/all (GET): Admin-only Route → Liste aller Benutzer
- Middleware:
  - authMiddleware.js prüft JWT
  - roleMiddleware.js prüft Benutzerrolle (z. B. admin, user)