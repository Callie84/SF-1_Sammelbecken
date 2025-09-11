const fs = require('fs');
const Seedbank = require('../models/Seedbank');
const path = require('path');

async function importSeedbanks() {
  const filePath = path.join(__dirname, '../data/seedbanks.json');
  const raw = fs.readFileSync(filePath);
  const list = JSON.parse(raw);
  for (const sb of list) {
    await Seedbank.updateOne({ name: sb.name }, sb, { upsert: true });
  }
  console.log(`Imported ${list.length} seedbanks`);
}

module.exports = { importSeedbanks };