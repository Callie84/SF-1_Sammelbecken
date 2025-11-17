// apps/price-service/src/routes/health.scraper.ts
import { Router } from "express";
import { redis } from "../config/redis";
import { HealthGuard } from "../scrapers/base/HealthGuard";

const router = Router();

/**
 * GET /health/scrapers/:seedbank
 * Antwort: { seedbank, disabled, since }
 */
router.get("/health/scrapers/:seedbank", async (req, res) => {
  const sb = req.params.seedbank;
  const guard = new HealthGuard({
    seedbank: sb,
    errorRateLimit: 0.05,
    banRateLimit: 0.005,
    windowSec: 600,
    disableMinutes: 30,
    minSamples: 50,
  });

  const disabled = await guard.isDisabled();
  res.json({
    seedbank: sb,
    disabled,
  });
});

/**
 * POST /health/scrapers/:seedbank/disable
 * zum manuellen Sperren für 30 Min
 */
router.post("/health/scrapers/:seedbank/disable", async (req, res) => {
  const sb = req.params.seedbank;
  await redis.setex(`sf1:scraper:${sb}:disabled`, 30 * 60, String(Date.now()));
  res.json({ ok: true, seedbank: sb, disabledForSec: 30 * 60 });
});

export default router;
