const path = require('path');
const { generateGrowCyclePDF } = require('../services/pdfService');

// Generiert PDF und liefert Download
exports.downloadPDF = async (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, '../../exports/growcycle_${id}.pdf');
  await generateGrowCyclePDF(id, filePath);
  res.download(filePath, `growcycle_${id}.pdf`);
};