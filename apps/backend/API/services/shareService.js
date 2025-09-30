const crypto = require("crypto");
const Wishlist = require("../models/Wishlist");

async function generateShareToken(wishlist) {
  const token = crypto.randomBytes(16).toString("hex");
  wishlist.shareToken = token;
  wishlist.shareExpires = Date.now() + 7 * 24 * 3600 * 1000; // 7 Tage
  await wishlist.save();
  return token;
}

async function getSharedWishlist(token) {
  const wishlist = await Wishlist.findOne({
    shareToken: token,
    shareExpires: { $gt: Date.now() },
  }).lean();
  return wishlist;
}

module.exports = { generateShareToken, getSharedWishlist };
