🩺 Diagnose-Tool – Teil 2:
- Service: classifyImage(imagePath) → { diagnosis, confidence } (Placeholder für echtes ML)
- Controller:
  • GET /diagnose/:id/classify → detaillierte Klassifikation zum Hochgeladenen Bild
  • POST /diagnose/:id/feedback { correct, comment } → speichert Nutzer-Feedback
- Modell-Erweiterung: Diagnosis Schema nun mit Feld 'feedback' (correct, comment, date)
- Auth erforderlich (authMiddleware)