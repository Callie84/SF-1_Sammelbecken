const Threshold = require("../models/Threshold");

// Schwellenwert erstellen
exports.createThreshold = async (req, res) => {
  const th = new Threshold({ userId: req.user.id, ...req.body });
  await th.save();
  res.status(201).json(th);
};

// Liste aller Schwellen für Nutzer
exports.listThresholds = async (req, res) => {
  const list = await Threshold.find({ userId: req.user.id });
  res.json(list);
};

// Schwellenwert löschen
exports.deleteThreshold = async (req, res) => {
  await Threshold.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Threshold gelöscht" });
};
