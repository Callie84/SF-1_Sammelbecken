const Diagnosis = require('../models/Diagnosis');
const { analyzeImage } = require('../services/diagnoseService');
const path = require('path');

// Bild hochladen und Diagnose starten
exports.uploadAndDiagnose = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Kein Bild hochgeladen' });
  const imageUrl = `/uploads/diagnose/${req.file.filename}`;
  const diag = new Diagnosis({ userId: req.user.id, imageUrl });
  await diag.save();
  // Simuliere Analyse
  try {
    const symptoms = analyzeImage(path.join(__dirname, '../../uploads/diagnose/', req.file.filename));
    diag.symptomsDetected = symptoms;
    diag.status = 'completed';
    diag.completedAt = new Date();
    await diag.save();
    res.json(diag);
  } catch (err) {
    diag.status = 'failed';
    await diag.save();
    res.status(500).json({ error: 'Analyse fehlgeschlagen' });
  }
};

// Liste aller Diagnosen eines Nutzers
exports.listDiagnoses = async (req, res) => {
  const list = await Diagnosis.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
};