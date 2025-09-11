🏗️ Modul 12 – Teil 1: Seedbank-Datenbank initial
- Datei: data/seedbanks.json mit 5 Seedbank-Einträgen
- Service: seedbankService.importSeedbanks() liest JSON und importiert/upsertet
- Controller: listSeedbanks() liefert alle Seedbanks sortiert nach Name
- Route: GET /api/seedbanks
- Model: Seedbank.js Schema mit allen Feldern
- Usage: Nach Server-Start seedbankService.importSeedbanks() einmal ausführen