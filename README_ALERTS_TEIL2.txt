🔔 WebPush & E-Mail Alerts – Teil 2:
- Service:
  • processAlerts(): prüft alle offenen PriceAlert, sendet E-Mail & WebPush
- Cronjob:
  • cron/alertCron.js: läuft alle 30 Minuten
- Templates:
  • templates/alertEmail.html: E-Mail-Template mit Platzhaltern {{strain}}, {{seedbank}}, {{price}}
- Multi-Channel:
  • E-Mail an user.email
  • WebPush mit Payload { title, message }