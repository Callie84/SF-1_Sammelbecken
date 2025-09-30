const Seed = require("../models/Seed");
const PriceEntry = require("../models/PriceEntry");
const AffiliateLink = require("../models/AffiliateLink");

async function getSeedDetail(strain) {
  const seed = await Seed.findOne({ strain }).lean();
  if (!seed) throw new Error("Sorte nicht gefunden");

  // Alle Preis-Einträge für diese Sorte
  const prices = await PriceEntry.find({ strain }).lean();

  // Affiliate-Link je Seedbank, falls vorhanden
  const affiliateLinks = await AffiliateLink.find({
    seedbank: { $in: prices.map((p) => p.seedbank) },
  }).lean();
  const affiliateMap = affiliateLinks.reduce((map, a) => {
    map[a.seedbank] = a.url;
    return map;
  }, {});

  // Kombinierte Angebote
  const offers = prices.map((p) => ({
    seedbank: p.seedbank,
    price: p.price,
    currency: p.currency,
    affiliateUrl: affiliateMap[p.seedbank] || p.url,
  }));

  return { ...seed, offers };
}

module.exports = { getSeedDetail };
