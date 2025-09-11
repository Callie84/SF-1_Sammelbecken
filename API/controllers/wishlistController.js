const Wishlist = require('../models/Wishlist');

// Liste aller Wunschlisten abrufen
exports.getLists = async (req, res) => {
  const lists = await Wishlist.find({ userId: req.user.id });
  res.json(lists);
};

// Neue Liste erstellen
exports.createList = async (req, res) => {
  const { name } = req.body;
  const list = new Wishlist({ userId: req.user.id, name, items: [] });
  await list.save();
  res.status(201).json(list);
};

// Liste löschen
exports.deleteList = async (req, res) => {
  await Wishlist.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Liste gelöscht' });
};

// Item zur Liste hinzufügen
exports.addItem = async (req, res) => {
  const { strain, note } = req.body;
  const list = await Wishlist.findOne({ _id: req.params.id, userId: req.user.id });
  if (!list) return res.status(404).json({ error: 'Liste nicht gefunden' });
  list.items.push({ strain, note });
  await list.save();
  res.json(list);
};

// Item entfernen
exports.removeItem = async (req, res) => {
  const list = await Wishlist.findOne({ _id: req.params.id, userId: req.user.id });
  if (!list) return res.status(404).json({ error: 'Liste nicht gefunden' });
  list.items = list.items.filter(item => item.strain !== req.params.strain);
  await list.save();
  res.json(list);
};