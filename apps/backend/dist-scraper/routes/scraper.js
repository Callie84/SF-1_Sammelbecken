"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraperRouter = scraperRouter;
const express_1 = require("express");
function scraperRouter(db) {
    const r = (0, express_1.Router)();
    r.post("/scraper/enqueue", async (req, res) => {
        const p = req.body;
        if (!p?.source || !p?.seedId || !p?.url)
            return res.status(400).json({ error: "missing fields" });
        const d = new Date();
        const uniqueKey = [p.source, p.seedId, p.variant ?? "", d.toISOString().slice(0, 10)].join("|");
        try {
            await db.collection("scraper.jobs").insertOne({
                state: "queued", payload: p, attempts: 0, createdAt: d, updatedAt: d, uniqueKey, nextRunAt: new Date(0)
            });
            res.json({ enqueued: true });
        }
        catch (e) {
            if (e?.code === 11000)
                return res.json({ enqueued: false, reason: "duplicate" });
            throw e;
        }
    });
    return r;
}
