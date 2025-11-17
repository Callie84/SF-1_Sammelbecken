import { MongoClient } from 'mongodb';
import { JobStore } from './job.model';
import { ScraperQueue } from './queue';
import { registry } from './metrics';
import express from 'express';
import fetch from 'node-fetch';


const MONGO_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB ?? 'sf1';
const INTERVAL_MS = Number(process.env.SCRAPER_POLL_MS ?? 200);


async function run() {
const mc = new MongoClient(MONGO_URI);
await mc.connect();
const db = mc.db(DB_NAME);
const store = new JobStore(db);
await store.ensureIndexes();
const q = new ScraperQueue(store);


// metrics server
const app = express();
app.get('/metrics', async (_req, res) => {
await q.refreshCounts();
res.set('Content-Type', registry.contentType);
res.send(await registry.metrics());
});
const port = Number(process.env.METRICS_PORT ?? 9309);
app.listen(port);


async function handler(job: any) {
// BeispielÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Scrape. Real: HTML parsen, Preise extrahieren, Upsert.
const res = await fetch(job.payload.url, { redirect: 'follow' });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
// TODO: Parser je Quelle. Ergebnis ins PreiseÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Repository upserten.
return;
}


// polling loop
// eslintÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“disableÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“nextÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“line noÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“constantÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“condition
while (true) {
try {
const worked = await q.pollAndRun(handler, { leaseMs: 60_000, hbMs: 20_000, maxAttempts: 5 });
if (!worked) await new Promise(r => setTimeout(r, INTERVAL_MS));
} catch {}
}
}


run().catch(err => { console.error(err); process.exit(1); });