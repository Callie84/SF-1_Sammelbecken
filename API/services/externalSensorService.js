// Stub für Integration externer Sensor-Netzwerke
async function fetchExternalSensorData(networkId) {
  // Simuliert API-Call zu externem SensorNetz
  return [
    {
      sensorId: "ext1",
      type: "temperature",
      value: 24.5,
      timestamp: new Date(),
    },
    { sensorId: "ext1", type: "humidity", value: 60, timestamp: new Date() },
  ];
}

module.exports = { fetchExternalSensorData };
