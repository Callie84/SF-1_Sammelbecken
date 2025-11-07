import { Router } from "express";
import { Db } from "mongodb";

export function scraperHealthRouter(db: Db) {
  const r = Router();
  r.get("/health/scraper", async (_req, res) => {
    const agg = await db.collection("scraper.jobs").aggregate([
      { $group: { _id: "$state", n: { $sum: 1 } } }
    ]).toArray();
    const map: Record<string, number> = {};
    for (const a of agg) map[a._id] = a.n;
    const dead = await db.collection("scraper.jobs").find({ state: "dead" }).sort({ updatedAt: -1 }).limit(5).toArray();
    res.json({ states: map, recentDead: dead.map(d => ({ id: d._id, err: d.lastError, at: d.updatedAt })) });
  });
  return r;
}
