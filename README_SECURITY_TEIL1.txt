🔒 Token & Security – Teil 1:
- Service:
  • generateAccessToken(payload) → Access-Token (15m)
  • generateRefreshToken(payload) → Refresh-Token (7d)
  • verifyRefreshToken(token)
- Controller:
  • POST /security/refresh-token → JSON { token } → neues accessToken
- Middleware:
  • rateLimit: 100 Anfragen / 15min
  • securityMiddleware: helmet, xss-clean, express-mongo-sanitize
- .env:
  • JWT_SECRET
  • REFRESH_TOKEN_SECRET