🌡️ Umweltmonitor – Teil 4:
- **SMS-Alarm-Service**:
  • checkThresholdSMS(): prüft Thresholds und sendet SMS an konfigurierten Empfänger
  • Holt Telefonnummer aus IntegrationSettings (service='sms')
- **Cronjob**:
  • cron/smsThresholdCron.js (alle 10 Minuten)
- **Integration**:
  • Voraussetzung: IntegrationSettings mit { service: 'sms', config: { phoneNumber } }
  • Verwendet smsService.sendSMS()
- Nach SMS-Versand wird Threshold gelöscht (einmaliger Alarm)