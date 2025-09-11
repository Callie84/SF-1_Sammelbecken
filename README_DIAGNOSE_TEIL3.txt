🩺 Diagnose-Tool – Teil 3:
- **Training Endpoint**:
  • POST /diagnose/train → startet externen Trainingsprozess (Python-Skript)
  • Requires Admin (authMiddleware)
- **Inference Endpoint**:
  • POST /diagnose/predict (FormData 'image') → liefert { diagnosis, confidence }
  • Nutzt upload middleware + inferenceService.predict()
- **Services**:
  • trainingService.trainModel()
  • inferenceService.predict(imagePath)
- **Uploads**: Verwendet denselben Upload-Pfad wie Teil 1  
- **Model**: Ablage der Modelle unter `ml/models/` (nicht inkludiert)