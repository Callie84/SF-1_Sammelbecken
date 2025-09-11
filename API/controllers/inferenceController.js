const { predict } = require('../services/inferenceService');
const path = require('path');

// POST /diagnose/predict (multipart/form-data 'image')
exports.predict = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Kein Bild hochgeladen' });
  const imagePath = path.join(__dirname, '../../uploads/diagnose', req.file.filename);
  try {
    const result = await predict(imagePath);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};