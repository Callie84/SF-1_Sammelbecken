const Shop = require("../models/Shop");

exports.listShops = async (req, res) => {
  const shops = await Shop.find();
  res.json(shops);
};

exports.addShop = async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
