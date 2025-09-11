const { getAdsByPosition, recordImpression, recordClick } = require("../services/adService");

// Liefert eine Ad für eine Position
exports.serveAd = async (req, res) => {
  const { position } = req.params;
  const ads = await getAdsByPosition(position, 1);
  if (!ads.length) return res.status(404).json({ error: "Keine Ads gefunden" });
  const ad = ads[0];
  await recordImpression(ad._id);
  res.json(ad);
};

// Klick-Tracking
exports.clickAd = async (req, res) => {
  const { id } = req.params;
  await recordClick(id);
  res.json({ message: "Klick aufgezeichnet" });
};