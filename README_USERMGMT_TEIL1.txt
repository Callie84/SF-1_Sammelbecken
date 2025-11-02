🔐 Nutzerverwaltung – Teil 1:
- **Modell**: Token (userId, token, type: verify|reset, expires)
- **Services**:
  • sendVerificationEmail(user): erstellt Verify-Token, sendet E-Mail-Link  
  • sendPasswordResetEmail(user): erstellt Reset-Token, sendet E-Mail-Link  
- **Controller**:
  • GET /verify/:token → bestätigt E-Mail  
  • POST /password-reset { email } → sendet Reset-Link-E-Mail  
  • POST /password-reset/:token { password } → setzt neues Passwort  
- **Routen**: `/verify` & `/password-reset`  
- **Voraussetzungen**: FRONTEND_URL, emailService.sendEmail