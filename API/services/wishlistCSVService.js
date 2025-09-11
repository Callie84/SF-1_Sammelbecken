const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const WishlistItem = require('../models/WishlistItem'); // assuming such model

// CSV-Import: Liest data/wishlist_import.csv
async function importWishlistFromCSV(userId) {
  const filePath = path.resolve(__dirname, '../data/wishlist_import.csv');
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => items.push(row))
      .on('end', async () => {
        for (const r of items) {
          // r should have strain, note
          await WishlistItem.create({ userId, strain: r.strain, note: r.note });
        }
        resolve(`Imported ${items.length} wishlist items`);
      })
      .on('error', reject);
  });
}

// CSV-Export: export current wishlist
async function exportWishlistCSV(userId) {
  const items = await WishlistItem.find({ userId }).lean();
  const fields = ['strain', 'note', 'addedAt'];
  const parser = new Parser({ fields });
  return parser.parse(items.map(i => ({
    strain: i.strain,
    note: i.note || '',
    addedAt: i.addedAt.toISOString()
  })));
}

module.exports = { importWishlistFromCSV, exportWishlistCSV };