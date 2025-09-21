const GrowCycle = require("../models/GrowCycle");

// Neue Grow-Zyklus erstellen
exports.createCycle = async (req, res) => {
  const cycle = new GrowCycle({ userId: req.user.id, ...req.body });
  await cycle.save();
  res.status(201).json(cycle);
};

// Alle Zyklen abrufen
exports.getCycles = async (req, res) => {
  const cycles = await GrowCycle.find({ userId: req.user.id });
  res.json(cycles);
};

// Einzelnen Zyklus abrufen
exports.getCycle = async (req, res) => {
  const cycle = await GrowCycle.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!cycle) return res.status(404).json({ error: "Zyklus nicht gefunden" });
  res.json(cycle);
};

// Zyklus löschen
exports.deleteCycle = async (req, res) => {
  await GrowCycle.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Zyklus gelöscht" });
};
