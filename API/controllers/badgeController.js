const { Badge, UserBadge } = require("../models/Badge");

// Badge erstellen (Admin)
exports.createBadge = async (req, res) => {
  const badge = new Badge(req.body);
  await badge.save();
  res.status(201).json(badge);
};

// Badge einem Nutzer verleihen
exports.awardBadge = async (req, res) => {
  const { badgeId, userId } = req.body;
  const ub = new UserBadge({ badgeId, userId });
  await ub.save();
  res.json(ub);
};

// Liste aller Badges eines Nutzers
exports.listUserBadges = async (req, res) => {
  const ub = await UserBadge.find({ userId: req.params.userId }).populate(
    "badgeId",
  );
  res.json(ub);
};
