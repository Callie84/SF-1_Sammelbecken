🏢 Seedbank-Management – Teil 2:
- Service: importSeedbanksFromCSV(filePath) → CSV|Pipe-delimited | Upsert
- Route: POST /seedbanksAdmin/bulk (Admin), Form-Field 'file' (CSV)
- Validierung rudimentär: Pflichtfelder name,url
- Upload-Pfad: /uploads
- Abhängigkeiten: csv-parser, multer