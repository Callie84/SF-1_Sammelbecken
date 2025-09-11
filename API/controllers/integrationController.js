const IntegrationSettings = require('../models/IntegrationSettings');
const { sendSMS } = require('../services/smsService');
const { fetchExternalSensorData } = require('../services/externalSensorService');

// Einstellungen speichern
exports.saveSettings = async (req, res) => {
  const { service, config } = req.body;
  let setting = await IntegrationSettings.findOne({ userId: req.user.id, service });
  if (setting) {
    setting.config = config;
  } else {
    setting = new IntegrationSettings({ userId: req.user.id, service, config });
  }
  await setting.save();
  res.json(setting);
};

// Externe Daten abrufen
exports.getExternalData = async (req, res) => {
  const { networkId } = req.params;
  const data = await fetchExternalSensorData(networkId);
  res.json(data);
};

// SMS-Benachrichtigung manuell senden
exports.sendManualSMS = async (req, res) => {
  const { phoneNumber, message } = req.body;
  const result = await sendSMS(phoneNumber, message);
  res.json(result);
};