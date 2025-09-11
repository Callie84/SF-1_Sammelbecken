🔒 Token & Security – Teil 2:
- Password Reset:
  • POST /security/request-reset { email } -> generiert Token
  • POST /security/reset-password { token, newPassword } -> setzt Passwort zurück
- MFA (Two-Factor Authentication):
  • POST /security/mfa/enable -> liefert otpauth_url (QR-Code)
  • POST /security/mfa/verify { token } -> aktiviert MFA
- HTTPS Setup:
  • Datei httpsServer.js startet HTTPS mit SSL_KEY_PATH & SSL_CERT_PATH
  • Setze Umgebungsvariablen in .env