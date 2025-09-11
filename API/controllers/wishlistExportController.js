const Wishlist = require('../models/Wishlist');
const { Parser } = require('json2csv');

exports.exportWishlistCSV = async (req, res) => {
  const { id } = req.params;
  const wishlist = await Wishlist.findOne({ _id: id, userId: req.user.id }).lean();
  if (!wishlist) return res.status(404).json({ error: 'Liste nicht gefunden' });

  const fields = ['strain', 'note', 'addedAt'];
  const parser = new Parser({ fields });
  const csv = parser.parse(wishlist.items);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${wishlist.name}.csv`);
  res.send(csv);
};