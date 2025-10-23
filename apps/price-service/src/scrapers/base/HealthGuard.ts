import { redis } from '../../config/redis';


interface Counters { fail: number; ban: number; ok: number; windowStart: number; }


const KEY = (sb: string) => `sf1:scraper:${sb}:counters`;
const DISABLE_KEY = (sb: string) => `sf1:scraper:${sb}:disabled`;


export interface GuardOptions {
seedbank: string;
errorRateLimit: number; // z.Ã¢â‚¬Â¯B. 0.05
banRateLimit: number; // z.Ã¢â‚¬Â¯B. 0.005
windowSec: number; // 600
disableMinutes: number; // 30
minSamples: number; // 50
}


export class HealthGuard {
constructor(private opts: GuardOptions) {}


async add(status: 'ok' | 'fail' | 'ban') {
const key = KEY(this.opts.seedbank);
const now = Math.floor(Date.now() / 1000);


const raw = await redis.get(key);
let c: Counters = raw ? JSON.parse(raw) : { fail: 0, ban: 0, ok: 0, windowStart: now };


if (now - c.windowStart > this.opts.windowSec) c = { fail: 0, ban: 0, ok: 0, windowStart: now };


c[status]++;
await redis.setex(key, this.opts.windowSec, JSON.stringify(c));


return this.evaluate(c);
}


async isDisabled(): Promise<boolean> {
const until = await redis.get(DISABLE_KEY(this.opts.seedbank));
}