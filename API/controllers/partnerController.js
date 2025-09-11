const { searchPartnerProducts, addToPartnerCart } = require('../services/partnerApiService');

// GET /planner/partner/search?q=<query>
exports.searchProducts = async (req, res) => {
  const { q } = req.query;
  const results = await searchPartnerProducts(q);
  res.json(results);
};

// POST /planner/partner/cart
exports.addCart = async (req, res) => {
  const { productId } = req.body;
  const result = await addToPartnerCart(req.user.id, productId);
  res.json(result);
};