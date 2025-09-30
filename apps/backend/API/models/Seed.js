const mongoose = require("mongoose");

const PackSchema = new mongoose.Schema(
  {
    pack_size: String,
    price_eur: Number,
  },
  { _id: false },
);

const SeedSchema = new mongoose.Schema({
  strain: { type: String, unique: true },
  seedbank: String,
  genetics: String,
  thc: Number,
  cbd: Number,
  flowering_time: String,
  indoor_yield: String,
  price_per_pack: [PackSchema],
});

module.exports = mongoose.model("Seed", SeedSchema);
