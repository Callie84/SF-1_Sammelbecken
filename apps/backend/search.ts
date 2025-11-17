/**
 * SF-1 Search Service (Meilisearch)
 * - liest SEARCH_URL + SEARCH_KEY aus ENV
 * - bietet /api/search?q=... an
 */

import express from "express";
import { MeiliSearch } from "meilisearch";

const router = express.Router();

const client = new MeiliSearch({
  host: process.env.SEARCH_URL || "http://sf1-search:7700",
  apiKey: process.env.SEARCH_KEY || "",
});

router.get("/search", async (req, res) => {
  const q = (req.query.q as string)?.trim();
  if (!q) return res.json({ hits: [] });

  try {
    const result = await client.index("seeds").search(q, {
      limit: 20,
      attributesToHighlight: ["name", "breeder"],
    });
    res.json(result.hits);
  } catch (err) {
    console.error("[SF-1] Search Error:", err);
    res.status(500).json({ error: "search_failed" });
  }
});

export default router;
