const cron = require('node-cron');
const { checkThresholds } = require('../services/alertMonitorService');

// Cronjob alle 10 Minuten
cron.schedule('*/10 * * * *', () => {
  console.log('🔍 Prüfe Threshold-Alarme...');
  checkThresholds().catch(console.error);
});