const cron = require('node-cron');
const { checkThresholdSMS } = require('../services/smsThresholdService');

// Cronjob alle 10 Minuten
cron.schedule('*/10 * * * *', () => {
  console.log('📱 Prüfe SMS-Threshold-Alarme...');
  checkThresholdSMS().catch(console.error);
});