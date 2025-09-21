const {
  importWishlistFromCSV,
  exportWishlistCSV,
} = require("../services/wishlistCSVService");

exports.importCSV = async (req, res) => {
  try {
    const msg = await importWishlistFromCSV(req.user.id);
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const csv = await exportWishlistCSV(req.user.id);
    res.header("Content-Type", "text/csv");
    res.attachment("wishlist_export.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
