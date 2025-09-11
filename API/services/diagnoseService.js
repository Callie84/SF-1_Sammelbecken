// Placeholder: Simuliert Bildanalyse und erkennt zufällige Symptome
const symptomsPool = ['Schimmel', 'Nährstoffmangel', 'Saugschädlinge', 'Pilzbefall', 'Kalzium-Mangel'];

function analyzeImage(imagePath) {
  // Hier würde ein echtes ML-Modell stehen
  const count = Math.floor(Math.random() * 3) + 1;
  const detected = [];
  while (detected.length < count) {
    const sym = symptomsPool[Math.floor(Math.random() * symptomsPool.length)];
    if (!detected.includes(sym)) detected.push(sym);
  }
  return detected;
}

module.exports = { analyzeImage };