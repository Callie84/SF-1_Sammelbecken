🌡️ Umweltmonitor – Teil 1:
- Modell: SensorReading (sensorId, type: temperature/humidity/co2, value, timestamp)
- Service:
  • addReading({ sensorId, type, value, timestamp })
  • getLatestReadings(sensorId, type, limit)
- Controller & Routen:
  • POST /monitor/readings { sensorId, type, value, timestamp? }
  • GET /monitor/readings?sensorId=&type=&limit=
- Auth erforderlich (JWT)