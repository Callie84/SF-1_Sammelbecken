🔔 WebPush & E-Mail Alerts – Teil 1:
- Modelle:
  • PushSubscription (Endpoint, Keys)  
- Services:
  • emailService.sendEmail(to, subject, text, html)  
  • webpushService.sendWebPush(userId, payload)  
- Controller & Routen (auth-geschützt):
  • POST /notifications/subscribe { endpoint, keys }  
  • POST /notifications/unsubscribe { endpoint }  
  • POST /notifications/trigger { userId, email, title, message } (Test-Trigger)  
- .env: Email + WebPush Schlüssel und Einstellungen