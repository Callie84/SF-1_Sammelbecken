// apps/price-service/src/server.ts
import express from "express";
import healthScraperRouter from "./routes/health.scraper.js";

const app = express();
app.use(express.json());

// Routen
app.use(healthScraperRouter);

// Test-Route
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "price-service" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`[price-service] listening on http://localhost:${port}`);
});
