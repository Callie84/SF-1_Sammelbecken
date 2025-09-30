const path = require("path");
// Placeholder: lade vortrainiertes Modell
async function predict(imagePath) {
  // In echt: TensorFlow/PyTorch Inferenz
  // Hier simuliert: Zufällige Auswahl
  const classes = [
    "Schimmel",
    "Nährstoffmangel",
    "Pilzbefall",
    "Saugschädlinge",
    "Gesund",
  ];
  const idx = Math.floor(Math.random() * classes.length);
  return {
    diagnosis: classes[idx],
    confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
  };
}

module.exports = { predict };
