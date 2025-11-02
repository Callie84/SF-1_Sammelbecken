🌱 GrowManager PRO – Teil 2:
- Cronjob: cron/reminderCron.js (alle 6h) für Erinnerungen in GrowCycle.reminders
- Service: processReminders(): sendet E-Mail/WebPush und markiert sent=true
- PDF-Export:
  • GET /pdf/growcycles/:id/pdf → generiert und liefert PDF zum GrowCycle
  • PDF generiert mit pdfkit: Titel, Strain, Dauer, Einträge
- Export-Pfad: /exports/growcycle_<id>.pdf