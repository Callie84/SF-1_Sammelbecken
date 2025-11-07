import { Router } from 'express';
import { scraperGuard } from '../services/scraper.guard.service';


const router = Router();


router.get('/health/scrapers/:key', async (req, res) => {
const key = req.params.key;
const disabled = await scraperGuard.disabled(key);
res.json({ key, disabled });
});


export default router;