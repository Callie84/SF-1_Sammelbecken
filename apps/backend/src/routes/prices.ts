import { Router } from "express";
import Seed from "../models/seed";

const router = Router();

router.get("/today", async (_req, res) => {
  const since = new Date();
  since.setHours(0,0,0,0);
  const seeds = await Seed.find({ lastUpdated: { $gte: since } }).select("name currentPrices lastUpdated").limit(2000).lean();
  return res.json(seeds);
});

router.get("/search", async (req, res) => {
  const q = String(req.query.query || "").trim();
  if (!q) return res.json([]);
  const seeds = await Seed.find({ name: { $regex: q, $options: "i" } }).select("name currentPrices lastUpdated").limit(100).lean();
  return res.json(seeds);
});

export default router;