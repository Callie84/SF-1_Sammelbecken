const Device = require('../models/Device');

// Gerät registrieren
exports.registerDevice = async (req, res) => {
  const { deviceId, deviceName } = req.body;
  let device = await Device.findOne({ userId: req.user.id, deviceId });
  if (!device) {
    device = new Device({ userId: req.user.id, deviceId, deviceName, lastSync: new Date() });
    await device.save();
  }
  res.json(device);
};

// Alle Geräte auflisten
exports.listDevices = async (req, res) => {
  const devices = await Device.find({ userId: req.user.id });
  res.json(devices);
};