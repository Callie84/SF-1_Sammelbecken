💾 Backup & Export – Teil 2:
- Cronjob: `cron/backupCron.js` führt täglich um 00:00 Uhr Backups aus
- Nutzt exportService für JSON + CSV
- Export-Pfad: `/exports` (Docker-Volume mounten)
- Beispiel Docker-Compose:
  volumes:
    - ./exports:/app/exports
  command: node API/cron/backupCron.js