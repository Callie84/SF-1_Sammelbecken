import mongoose from "mongoose";
import { log } from "./logger";

export async function connect() {
  const uri = process.env.MONGO_URI!;
  await mongoose.connect(uri);
  log.info("mongo connected");
}

const PriceSchema = new mongoose.Schema({
  seedbank: String,
  price: Number,
  currency: { type: String, default: "EUR" }
}, { _id: false });

const SeedSchema = new mongoose.Schema({
  name: { type: String, index: true },
  breeder: String,
  currentPrices: { type: [PriceSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now }
});

export const Seed = mongoose.model("Seed", SeedSchema);

export async function upsertPrices(batch: { name: string; breeder?: string; prices: { seedbank: string; price: number; currency: string }[] }[]) {
  for (const item of batch) {
    await Seed.updateOne(
      { name: item.name },
      { $set: { breeder: item.breeder, currentPrices: item.prices, lastUpdated: new Date() } },
      { upsert: true }
    );
  }
}