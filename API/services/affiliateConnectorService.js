const fetch = require("node-fetch");

// Beispiel: Connector für SeedExpress API
async function fetchSeedExpressOffers(strain) {
  const response = await fetch(
    `https://api.seedexpress.com/offers?strain=${encodeURIComponent(strain)}`,
  );
  if (!response.ok) throw new Error("SeedExpress API-Fehler");
  const data = await response.json();
  return data.offers.map((o) => ({
    seedbank: "SeedExpress",
    packSize: o.packSize,
    priceEur: o.price,
    url: o.url,
    lastUpdated: new Date(o.updatedAt),
  }));
}

// Beispiel: Connector für GreenShop API
async function fetchGreenShopOffers(strain) {
  const response = await fetch(
    `https://api.greenshop.com/v1/seeds?search=${encodeURIComponent(strain)}`,
    {
      headers: { Authorization: `Bearer ${process.env.GREENSHOP_API_KEY}` },
    },
  );
  if (!response.ok) throw new Error("GreenShop API-Fehler");
  const data = await response.json();
  return data.results.map((r) => ({
    seedbank: "GreenShop",
    packSize: `${r.quantity} Seeds`,
    priceEur: r.price_eur,
    url: r.product_url,
    lastUpdated: new Date(r.timestamp),
  }));
}

module.exports = { fetchSeedExpressOffers, fetchGreenShopOffers };
