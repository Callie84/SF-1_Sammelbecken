const { spawn } = require('child_process');
const path = require('path');

// Startet Modell-Training via Skript (z.B. Python Trainings-Pipeline)
async function trainModel() {
  return new Promise((resolve, reject) => {
    const script = spawn('python3', [path.resolve(__dirname, '../ml/train_model.py')]);
    script.stdout.on('data', data => console.log(`Training: ${data}`));
    script.stderr.on('data', data => console.error(`Training Error: ${data}`));
    script.on('close', code => {
      if (code === 0) resolve('Training abgeschlossen');
      else reject(new Error(`Training fehlgeschlagen mit Code ${code}`));
    });
  });
}

module.exports = { trainModel };