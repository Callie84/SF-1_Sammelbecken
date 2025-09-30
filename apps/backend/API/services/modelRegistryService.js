const fs = require("fs");
const path = require("path");

const MODEL_DIR = path.resolve(__dirname, "../../ml/models");

// Listet alle verfügbaren Modelle
function listModels() {
  return fs.readdirSync(MODEL_DIR).filter((f) => f.endsWith(".h5"));
}

// Löscht altes Modell
function deleteModel(filename) {
  const filePath = path.join(MODEL_DIR, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = { listModels, deleteModel };
