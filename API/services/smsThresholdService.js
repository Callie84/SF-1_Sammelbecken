const Threshold = require('../models/Threshold');
const IntegrationSettings = require('../models/IntegrationSettings');
const { sendSMS } = require('./smsService');

// Prüft Thresholds und sendet SMS, wenn konfiguriert
async function checkThresholdSMS() {
  const thresholds = await Threshold.find({});
  for (const th of thresholds) {
    const latest = await require('./sensorService').getLatestReadings(th.sensorId, th.type, 1);
    if (!latest || latest.length === 0) continue;
    const value = latest[0].value;
    const triggered = th.condition === 'above' ? value > th.value : value < th.value;
    if (triggered) {
      // Fetch user SMS settings
      const settings = await IntegrationSettings.findOne({ userId: th.userId, service: 'sms' });
      if (settings && settings.config && settings.config.phoneNumber) {
        const message = `Alarm: Sensor ${th.sensorId} ${th.type} ${th.condition} ${th.value}. Aktueller Wert: ${value}`;
        await sendSMS(settings.config.phoneNumber, message);
      }
      // Remove threshold after alert
      await Threshold.deleteOne({ _id: th._id });
    }
  }
}

module.exports = { checkThresholdSMS };