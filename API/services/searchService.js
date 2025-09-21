const Seed = require("../models/Seed");
const PriceEntry = require("../models/PriceEntry");

async function searchSeeds({
  query,
  seedbank,
  minPrice,
  maxPrice,
  sortBy,
  order,
  limit,
  page,
}) {
  const q = {};
  if (query) q.strain = { $regex: query, $options: "i" };
  if (seedbank) q.seedbank = seedbank;

  const priceMatch = {};
  if (minPrice !== undefined) priceMatch.$gte = parseFloat(minPrice);
  if (maxPrice !== undefined) priceMatch.$lte = parseFloat(maxPrice);

  // Pipeline for lookup PriceEntry and filter price
  const pipeline = [
    { $match: q },
    {
      $lookup: {
        from: "priceentries",
        localField: "strain",
        foreignField: "strain",
        as: "prices",
      },
    },
  ];
  if (minPrice !== undefined || maxPrice !== undefined) {
    pipeline.push({ $unwind: "$prices" });
    pipeline.push({ $match: { "prices.price": priceMatch } });
  }
  // Projection with lowest price
  pipeline.push({
    $addFields: {
      lowestPrice: { $min: "$prices.price" },
    },
  });
  // Sorting
  const sortField = sortBy || "strain";
  const sortOrder = order === "desc" ? -1 : 1;
  pipeline.push({ $sort: { [sortField]: sortOrder } });
  // Pagination
  const lim = parseInt(limit) || 20;
  const pg = parseInt(page) || 1;
  pipeline.push({ $skip: (pg - 1) * lim });
  pipeline.push({ $limit: lim });

  return Seed.aggregate(pipeline);
}

module.exports = { searchSeeds };
