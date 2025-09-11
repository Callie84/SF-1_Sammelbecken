const Ad = require("../models/Ad");

// Liefert aktive Ads für eine Position (gleichmäßige Rotation)
async function getAdsByPosition(position, limit = 1) {
  const ads = await Ad.find({ position, active: true });
  // Einfache Rotation: zufällige Auswahl
  return ads.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// Zählt Impression und Klick
async function recordImpression(adId) {
  await Ad.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
}

async function recordClick(adId) {
  await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
}

module.exports = { getAdsByPosition, recordImpression, recordClick };