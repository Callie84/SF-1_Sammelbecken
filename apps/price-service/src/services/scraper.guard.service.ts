import { HealthGuard } from '../scrapers/base/HealthGuard';
import { SCRAPER_CONFIG } from '../config/scraper.config';


const DEFAULTS = { errorRateLimit: 0.05, banRateLimit: 0.005, windowSec: 600, disableMinutes: 30, minSamples: 50 };


const GUARDS: Record<string, HealthGuard> = Object.fromEntries(
Object.keys(SCRAPER_CONFIG).map(k => [k, new HealthGuard({ seedbank: k, ...DEFAULTS })])
);


export const scraperGuard = {
async record(seedbank: string, status: 'ok' | 'fail' | 'ban') {
const g = GUARDS[seedbank];
if (!g) return { action: 'none' as const };
return g.add(status);
},
async disabled(seedbank: string) {
const g = GUARDS[seedbank];
return g ? g.isDisabled() : false;
}
};