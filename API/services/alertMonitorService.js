const SensorReading = require('../models/SensorReading');
const Threshold = require('../models/Threshold');
const { sendEmail } = require('./emailService');
const { sendWebPush } = require('./webpushService');

// Prüft Thresholds alle X Minuten
async function checkThresholds() {
  const thresholds = await Threshold.find({});
  for(const th of thresholds) {
    const latest = await SensorReading.findOne({ sensorId: th.sensorId, type: th.type })
      .sort({ timestamp: -1 }).lean();
    if(!latest) continue;
    const triggered = th.condition === 'above' ? latest.value > th.value : latest.value < th.value;
    if(triggered) {
      const userId = th.userId;
      const subject = `Alarm: ${th.type} ${th.condition} ${th.value}`;
      const text = `Sensor ${th.sensorId}: aktueller Wert ${latest.value}`;
      // Email und WebPush
      await sendEmail(userId, subject, text, `<p>${text}</p>`);
      await sendWebPush(userId, { title: subject, message: text });
      // Optionally, delete or disable threshold
      await Threshold.deleteOne({ _id: th._id });
    }
  }
}

module.exports = { checkThresholds };