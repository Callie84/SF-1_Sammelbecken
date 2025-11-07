import { Schema, model } from "mongoose";

const priceSchema = new Schema({
  seedbank: String,
  price: Number,
  currency: { type: String, default: "EUR" }
}, { _id: false });

const seedSchema = new Schema({
  name: { type: String, index: true },
  breeder: String,
  currentPrices: { type: [priceSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now }
});

export default model("Seed", seedSchema);