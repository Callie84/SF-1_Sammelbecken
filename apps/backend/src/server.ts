import express from "express";
import { MongoClient } from "mongodb";
import { scraperRouter } from "./routes/scraper";
import { scraperHealthRouter } from "./scraper/health";

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB ?? "sf1";

async function main() {
  const app = express();
  app.use(express.json());

  const mc = new MongoClient(MONGO_URI);
  await mc.connect();
  const db = mc.db(DB_NAME);

  app.use(scraperRouter(db));
  app.use(scraperHealthRouter(db));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.listen(PORT, () => {
    // ready
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
