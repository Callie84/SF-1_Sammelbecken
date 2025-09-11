const path = require('path');
const { exportJSONToFile, exportCollectionCSV } = require('../services/exportService');

exports.downloadJSON = async (req, res) => {
  const filePath = path.join(__dirname, '../../exports/data.json');
  await exportJSONToFile(filePath);
  res.download(filePath, 'sf1_export.json');
};

exports.downloadCSV = async (req, res) => {
  const { collection } = req.query;
  const collections = {
    users: ['username', 'email', 'role', 'createdAt'],
    growlogs: ['userId', 'title', 'strain', 'startedAt', 'createdAt'],
    alerts: ['userId', 'strain', 'seedbank', 'targetPrice', 'createdAt'],
    stats: ['strain', 'views', 'searches', 'clicks', 'updatedAt'],
    bookmarks: ['userId', 'strain', 'note', 'createdAt'],
    uploads: ['userId', 'strain', 'genetics', 'createdAt'],
    seedbanks: ['name', 'url', 'updatedAt']
  };
  if (!collections[collection]) {
    return res.status(400).json({ error: 'Ungültige Collection' });
  }
  const filePath = path.join(__dirname, `../../exports/${collection}.csv`);
  await exportCollectionCSV(require(`../models/${collection[0].toUpperCase() + collection.slice(1)}`), collections[collection], filePath);
  res.download(filePath, `${collection}.csv`);
};