const {
  getAffiliateLink,
  recordClick,
} = require("../services/affiliateService");

exports.redirectToAffiliate = async (req, res) => {
  try {
    const { seedbank } = req.params;
    const link = await getAffiliateLink(seedbank);
    const userId = req.user ? req.user.id : null;
    const ip = req.ip;
    const ua = req.headers["user-agent"];
    // record click asynchronously
    recordClick(link._id, userId, ip, ua).catch(console.error);
    // redirect to affiliate URL
    return res.redirect(link.url);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};
