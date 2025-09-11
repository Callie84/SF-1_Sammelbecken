const Diagnosis = require('../models/Diagnosis');
const { classifyImage } = require('../services/mlModelService');

// Endpunkt für detaillierte Klassifikation
exports.classify = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: 'ID fehlt' });
  const diag = await Diagnosis.findById(req.params.id);
  if (!diag) return res.status(404).json({ error: 'Diagnose nicht gefunden' });
  const imagePath = require('path').join(__dirname, '../../uploads/diagnose/', diag.imageUrl.split('/').pop());
  const result = await classifyImage(imagePath);
  res.json(result);
};

// Nutzer-Feedback speichern
exports.submitFeedback = async (req, res) => {
  const { id } = req.params;
  const { correct, comment } = req.body;
  const diag = await Diagnosis.findById(id);
  if (!diag) return res.status(404).json({ error: 'Diagnose nicht gefunden' });
  diag.feedback = { correct: !!correct, comment, date: new Date() };
  await diag.save();
  res.json({ message: 'Feedback gespeichert' });
};