import { Router } from 'express';
import { SCRAPER_CONFIG } from '../config/scraper.config';
import { scraperGuard } from '../services/scraper.guard.service';


const router = Router();


router.get('/scrapers', (_, res) => {
const list = Object.entries(SCRAPER_CONFIG).map(([key, cfg]) => ({ key, enabled: cfg.enabled, baseUrl: cfg.baseUrl }));
res.json({ data: list });
});


router.post('/scrapers/:key/enable', (req, res) => {
const { key } = req.params;
if (!(key in SCRAPER_CONFIG)) return res.status(404).json({ error: 'unknown' });
SCRAPER_CONFIG[key as keyof typeof SCRAPER_CONFIG].enabled = true;
res.json({ ok: true });
});


router.post('/scrapers/:key/disable', async (req, res) => {
const { key } = req.params;
if (!(key in SCRAPER_CONFIG)) return res.status(404).json({ error: 'unknown' });
// SoftÃ¢â‚¬â€˜Disable via Guard fÃƒÂ¼r 12h
await (await import('redis')).createClient().setEx(`sf1:scraper:${key}:disabled`, 12 * 3600, String(Date.now() + 12 * 3600_000));
res.json({ ok: true });
});


export default router;