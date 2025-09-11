const Ad = require("../models/Ad");
const AffiliateLink = require("../models/AffiliateLink");

// Ads auflisten
exports.listAds = async (req, res) => {
  const ads = await Ad.find();
  res.json(ads);
};
// Ad erstellen
exports.createAd = async (req, res) => {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Ad aktualisieren
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ error: "Ad nicht gefunden" });
    res.json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Ad löschen
exports.deleteAd = async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.json({ message: "Ad gelöscht" });
};
// Affiliate-Links verwalten analog
exports.listAffiliate = async (req, res) => {
  const links = await AffiliateLink.find();
  res.json(links);
};
exports.createAffiliate = async (req, res) => {
  try {
    const link = new AffiliateLink(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.updateAffiliate = async (req, res) => {
  try {
    const link = await AffiliateLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!link) return res.status(404).json({ error: "AffiliateLink nicht gefunden" });
    res.json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteAffiliate = async (req, res) => {
  await AffiliateLink.findByIdAndDelete(req.params.id);
  res.json({ message: "AffiliateLink gelöscht" });
};