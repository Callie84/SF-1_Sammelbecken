🩺 Diagnose-Tool – Teil 1:
- Modell: Diagnosis (userId, imageUrl, status, symptomsDetected, timestamps)
- Service: diagnoseService.analyzeImage(imagePath) – simulierte Bildanalyse
- Controller:
  • POST /diagnose/upload (Form-Field 'image') → speichert Bild, führt schnelle Analyse aus, speichert Resultate
  • GET /diagnose → listet eigene Diagnosen
- Upload-Pfad: /uploads/diagnose
- Auth erforderlich (authMiddleware)