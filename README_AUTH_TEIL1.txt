🔐 Auth – Teil 1: Registrierung & Login
- Modell: User (username, email, passwordHash, role)
- Controller:
  • POST /auth/register { username, email, password }
  • POST /auth/login { email, password } → gibt accessToken (JWT, 1h) zurück
- Middleware: authMiddleware prüft Bearer-Token und setzt req.user