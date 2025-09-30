const AffiliateLink = require("../models/AffiliateLink");

// Alle Affiliate-Links listen
exports.listAffiliateLinks = async (req, res) => {
  const links = await AffiliateLink.find();
  res.json(links);
};

// Affiliate-Link hinzufügen
exports.createAffiliateLink = async (req, res) => {
  try {
    const link = new AffiliateLink(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Affiliate-Link aktualisieren
exports.updateAffiliateLink = async (req, res) => {
  try {
    const link = await AffiliateLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!link) return res.status(404).json({ error: "Link nicht gefunden" });
    res.json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Affiliate-Link löschen
exports.deleteAffiliateLink = async (req, res) => {
  await AffiliateLink.findByIdAndDelete(req.params.id);
  res.json({ message: "Link gelöscht" });
};
