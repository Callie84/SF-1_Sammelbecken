🌡️ Umweltmonitor – Teil 3:
- **IntegrationSettings** (Model):
  • service: 'sms' | 'external_api'
  • config: z.B. { phoneNumber, apiKey }
- **Services**:
  • smsService.sendSMS(phoneNumber, message)
  • externalSensorService.fetchExternalSensorData(networkId)
- **Controller**:
  • POST /monitor/integrations/settings → Speichert SMS/API-Einstellungen
  • GET /monitor/integrations/external/:networkId → Holt externe Sensor-Daten
  • POST /monitor/integrations/sms { phoneNumber, message } → Sendet SMS
- **Routes**: unter `/monitor/integrations` (auth-geschützt)