🔄 Modul 12 – Teil 2: Tägliche Seedbank-Aktualisierung
- Service: updateSeedbanksDaily() ruft importSeedbanks() auf
- Cronjob: cron/updateSeedbanks.js (täglich um 02:00 Uhr)
- Integration: Kann erweitert werden mit echten API/Scraper-Logik
- Usage: node cron/updateSeedbanks.js oder Docker-Container