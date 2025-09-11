const Shop = require("../models/Shop");
const Review = require("../models/Review");
const { logAction } = require("../services/adminLogService");

// Aktualisieren Shop-Daten (Admin)
exports.updateShop = async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!shop) return res.status(404).json({ error: "Shop nicht gefunden" });
  await logAction(req.user.id, "UPDATE_SHOP", { shopId: req.params.id, data: req.body });
  res.json(shop);
};

// Löschen Shop
exports.deleteShop = async (req, res) => {
  await Shop.findByIdAndDelete(req.params.id);
  await Review.deleteMany({ shopId: req.params.id });
  await logAction(req.user.id, "DELETE_SHOP", { shopId: req.params.id });
  res.json({ message: "Shop gelöscht" });
};