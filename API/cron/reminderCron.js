const cron = require('node-cron');
const { processReminders } = require('../services/reminderService');

// Cronjob alle 6 Stunden
cron.schedule('0 */6 * * *', () => {
  console.log('⏰ Starte GrowManager-Reminder-Check...');
  processReminders().then(() => {
    console.log('✅ Reminder-Check abgeschlossen');
  }).catch(console.error);
});