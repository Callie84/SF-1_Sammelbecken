const { addItem, calculateBudget } = require("../services/setupService");
const SetupItem = require("../models/SetupItem");

// POST /setup/items → neuen Eintrag hinzufügen
exports.createItem = async (req, res) => {
  const item = await addItem(req.user.id, req.body);
  res.status(201).json(item);
};

// GET /setup/items → alle Einträge listen
exports.listItems = async (req, res) => {
  const items = await SetupItem.find({ userId: req.user.id });
  res.json(items);
};

// GET /setup/budget → Gesamtbudget
exports.getBudget = async (req, res) => {
  const total = await calculateBudget(req.user.id);
  res.json({ totalBudget: total });
};

// PUT /setup/items/:id/purchase → Markiere als gekauft
exports.markPurchased = async (req, res) => {
  const item = await SetupItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { purchased: true },
    { new: true },
  );
  res.json(item);
};
