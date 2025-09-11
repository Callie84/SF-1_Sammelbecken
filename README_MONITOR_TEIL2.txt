🌡️ Umweltmonitor – Teil 2:
- Modell: Threshold (sensorId, type, condition above/below, value, userId)
- Service: checkThresholds(): prüft alle Thresholds und sendet Email/WebPush bei Auslösung
- Cronjob: cron/thresholdCron.js (alle 10 Minuten)
- Controller & Routen (auth):
  • POST /monitor/thresholds { sensorId, type, condition, value }
  • GET /monitor/thresholds
  • DELETE /monitor/thresholds/:id
- Nach Trigger Entfernung des Thresholds zur einmaligen Warnung