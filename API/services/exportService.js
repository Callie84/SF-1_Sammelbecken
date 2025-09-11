const User = require("../models/User");
const Growlog = require("../models/Growlog");
const PriceAlert = require("../models/PriceAlert");
const Statistik = require("../models/Statistik");
const Bookmark = require("../models/Bookmark");
const UploadedSeed = require("../models/UploadedSeed");
const Seedbank = require("../models/Seedbank");
const fs = require('fs');
const { Parser } = require('json2csv');

async function exportCollection(model, fields) {
  const data = await model.find().select(fields.join(' ')).lean();
  return data;
}

async function exportAllJSON() {
  const exportData = {
    users: await exportCollection(User, ['username', 'email', 'role', 'createdAt']),
    growlogs: await exportCollection(Growlog, ['userId', 'title', 'strain', 'startedAt', 'createdAt']),
    alerts: await exportCollection(PriceAlert, ['userId', 'strain', 'seedbank', 'targetPrice', 'createdAt']),
    stats: await exportCollection(Statistik, ['strain', 'views', 'searches', 'clicks', 'updatedAt']),
    bookmarks: await exportCollection(Bookmark, ['userId', 'strain', 'note', 'createdAt']),
    uploads: await exportCollection(UploadedSeed, ['userId', 'strain', 'genetics', 'createdAt']),
    seedbanks: await exportCollection(Seedbank, ['name', 'url', 'updatedAt'])
  };
  return exportData;
}

async function exportJSONToFile(filePath) {
  const data = await exportAllJSON();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function exportCollectionCSV(model, fields, filePath) {
  const data = await exportCollection(model, fields);
  const parser = new Parser({ fields });
  fs.writeFileSync(filePath, parser.parse(data));
}

module.exports = {
  exportJSONToFile,
  exportCollectionCSV
};