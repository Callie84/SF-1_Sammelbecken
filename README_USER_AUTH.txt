🚀 User Auth – Teil 1:
- /register (POST): Benutzer registrieren (username, email, password)
- /login (POST): Login, Antwort = JWT-Token
- JWT wird für spätere geschützte Routen verwendet
- Middleware 'authMiddleware.js' prüft Token