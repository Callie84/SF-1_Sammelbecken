const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Seed = require('../models/Seed');

// Importiert Samen-Daten aus CSV im data/seed_data.csv
async function importSeeds() {
  const filePath = path.resolve(__dirname, '../data/seed_data.csv');
  return new Promise((resolve, reject) => {
    const seeds = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        seeds.push(row);
      })
      .on('end', async () => {
        for (const r of seeds) {
          const filter = { strain: r.strain };
          const update = {
            genetics: r.genetics,
            breeder: r.breeder,
            thc: parseFloat(r.thc),
            cbd: parseFloat(r.cbd),
            floweringTime: r.floweringTime,
            indoorYield: r.indoorYield,
            images: r.images ? r.images.split('|') : [],
          };
          await Seed.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
        resolve(`Imported ${seeds.length} seeds`);
      })
      .on('error', reject);
  });
}

module.exports = { importSeeds };