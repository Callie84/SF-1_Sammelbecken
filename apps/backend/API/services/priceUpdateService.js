const Seed = require("../models/Seed");
const PriceEntry = require("../models/PriceEntry");

// Aggregiert neueste Preise aus PriceEntry und updatet Seed.priceOffers
async function updateSeedPrices() {
  const entries = await PriceEntry.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: { strain: "$strain", seedbank: "$seedbank" },
        doc: { $first: "$$ROOT" },
      },
    },
  ]);
  for (const { doc } of entries) {
    await Seed.updateOne(
      { strain: doc.strain },
      { $pull: { priceOffers: { seedbank: doc.seedbank } } },
    );
    await Seed.updateOne(
      { strain: doc.strain },
      {
        $push: {
          priceOffers: {
            seedbank: doc.seedbank,
            packSize: doc.packSize || "n/a",
            priceEur: doc.price,
            url: doc.url,
            lastUpdated: doc.timestamp,
          },
        },
      },
    );
  }
}
module.exports = { updateSeedPrices };
