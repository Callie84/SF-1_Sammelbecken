🩺 Diagnose-Tool – Teil 4:
- **Training-Pipeline** (`ml/train_model.py`):
  • TensorFlow/Keras Skript: Daten aus `TRAINING_DATA_DIR`, Training, Modell-Save in `ml/models/diagnose_model.h5`
  • Umgebungsvariablen: TRAINING_DATA_DIR, MODEL_DIR, EPOCHS
- **Modellverwaltung** (`modelRegistryService`):
  • listModels(): listet alle `.h5`-Modelle
  • deleteModel(name): löscht angegebenes Modell
- **Controller & Routen**:
  • GET `/diagnose/models`: listet vorhandene Modelle
  • DELETE `/diagnose/models/:name`: löscht Modell (Admin)
- **Sicherheit**: Routen nur für Admin