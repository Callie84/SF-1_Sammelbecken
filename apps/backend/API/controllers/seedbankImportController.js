const { importSeedbanksFromCSV } = require("../services/seedbankImportService");
const path = require("path");

exports.bulkImport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV-Datei fehlt" });
  }
  const filePath = path.join(__dirname, "../../uploads", req.file.filename);
  try {
    const result = await importSeedbanksFromCSV(filePath);
    res.json({ message: "Import erfolgreich", ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
