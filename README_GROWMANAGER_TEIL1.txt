🌱 GrowManager PRO – Teil 1:
- Modell: GrowCycle (title, strain, startDate, expectedDurationDays, entries[], reminders[])
- Controller:
  • POST /growcycles → Zyklus erstellen
  • GET /growcycles → alle Zyklen
  • GET /growcycles/:id → einzelnen Zyklus
  • DELETE /growcycles/:id → Zyklus löschen
- Reminder-Feld: Datum + Nachricht, später Teil 2 für Cron-Reminder
- Usage: startet Grow-Tagebuch ergänzend