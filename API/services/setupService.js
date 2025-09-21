const SetupItem = require("../models/SetupItem");

// Erstellt neuen Listeneintrag
async function addItem(userId, item) {
  const newItem = new SetupItem({ userId, ...item });
  await newItem.save();
  return newItem;
}

// Gesamtkosten berechnen
async function calculateBudget(userId) {
  const items = await SetupItem.find({ userId });
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

module.exports = { addItem, calculateBudget };
