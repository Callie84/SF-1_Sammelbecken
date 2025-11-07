import { Router } from 'express';
import crypto from 'crypto';
import Affiliate from '../models/affiliate';
import Click from '../models/click';

const router = Router();

function buildUrl(baseUrl: string, paramSlug: string, slug: string, utm: {source:string;medium:string;campaign:string}) {
  const u = new URL(baseUrl);
  u.searchParams.set(paramSlug, slug);
  u.searchParams.set('utm_source', utm.source || 'sf1');
  u.searchParams.set('utm_medium', utm.medium || 'affiliate');
  if (utm.campaign) u.searchParams.set('utm_campaign', utm.campaign);
  return u.toString();
}

router.get('/go/:partner/:slug', async (req, res) => {
  const { partner, slug } = req.params;
  const cfg = await Affiliate.findOne({ partner, active: true }).lean();
  if (!cfg) return res.status(404).send('Unknown partner');

  const target = buildUrl(cfg.baseUrl, cfg.paramSlug, slug, cfg.utm);
  const ua = req.headers['user-agent'] || '';
  const uaHash = crypto.createHash('sha256').update(ua).digest('hex');
  const ref = (req.headers['referer'] || '').toString().slice(0, 200);

  // Fire and forget, keine Latenz fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r User
  Click.create({ partner, slug, uaHash, ref }).catch(()=>{});

  return res.redirect(302, target);
});

export default router;