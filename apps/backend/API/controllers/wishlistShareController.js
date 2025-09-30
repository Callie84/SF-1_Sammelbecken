const {
  generateShareToken,
  getSharedWishlist,
} = require("../services/shareService");

exports.createShare = async (req, res) => {
  const { id } = req.params;
  const wishlist = await generateShareToken(
    await require("../models/Wishlist").findById(id),
  );
  const link = `${process.env.FRONTEND_URL}/share/${wishlist}`;
  res.json({ token: wishlist, link });
};

exports.getShare = async (req, res) => {
  const { token } = req.params;
  const wishlist = await getSharedWishlist(token);
  if (!wishlist)
    return res
      .status(404)
      .json({ error: "Share-Link ungültig oder abgelaufen" });
  res.json(wishlist);
};
