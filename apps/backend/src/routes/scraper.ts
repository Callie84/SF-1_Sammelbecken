import { Router } from "express";
import { Db } from "mongodb";
import { ScraperJobDoc } from "../types/scraper";

export function scraperRouter(db: Db) {
  const r = Router();
  r.post("/scraper/enqueue", async (req, res) => {
    const p = req.body as ScraperJobDoc["payload"];
    if (!p?.source || !p?.seedId || !p?.url) return res.status(400).json({ error: "missing fields" });
    const d = new Date();
    const uniqueKey = [p.source, p.seedId, p.variant ?? "", d.toISOString().slice(0,10)].join("|");
    try {
      await db.collection("scraper.jobs").insertOne({
        state: "queued", payload: p, attempts: 0, createdAt: d, updatedAt: d, uniqueKey, nextRunAt: new Date(0)
      } as any);
      res.json({ enqueued: true });
    } catch (e: any) {
      if (e?.code === 11000) return res.json({ enqueued: false, reason: "duplicate" });
      throw e;
    }
  });
  return r;
}
