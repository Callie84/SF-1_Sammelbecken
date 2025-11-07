// apps/price-service/src/scrapers/base/HealthGuard.ts
import { redis } from "../../config/redis";

interface Counters {
  fail: number;
  ban: number;
  ok: number;
  windowStart: number;
}

const KEY = (sb: string) => `sf1:scraper:${sb}:counters`;
const DISABLE_KEY = (sb: string) => `sf1:scraper:${sb}:disabled`;

export interface GuardOptions {
  seedbank: string;
  errorRateLimit: number;      // z.B. 0.05
  banRateLimit: number;        // z.B. 0.005
  windowSec: number;           // z.B. 600
  disableMinutes: number;      // z.B. 30
  minSamples: number;          // z.B. 50
}

export class HealthGuard {
  constructor(private opts: GuardOptions) {}

  async add(status: "ok" | "fail" | "ban") {
    const key = KEY(this.opts.seedbank);
    const now = Math.floor(Date.now() / 1000);

    const raw = await redis.get(key);
    let c: Counters = raw
      ? JSON.parse(raw)
      : { fail: 0, ban: 0, ok: 0, windowStart: now };

    // neues Zeitfenster
    if (now - c.windowStart > this.opts.windowSec) {
      c = { fail: 0, ban: 0, ok: 0, windowStart: now };
    }

    c[status]++;

    await redis.setex(key, this.opts.windowSec, JSON.stringify(c));

    return this.evaluate(c);
  }

  async isDisabled(): Promise<boolean> {
    const untilStr = await redis.get(DISABLE_KEY(this.opts.seedbank));
    if (!untilStr) return false;
    const until = parseInt(untilStr, 10);
    const now = Math.floor(Date.now() / 1000);
    return now < until;
  }

  private async disableNow() {
    const until = Math.floor(Date.now() / 1000) + this.opts.disableMinutes * 60;
    await redis.set(DISABLE_KEY(this.opts.seedbank), String(until));
  }

  private async evaluate(c: Counters) {
    const total = c.ok + c.fail + c.ban;
    if (total < this.opts.minSamples) {
      return { disabled: false, reason: "not-enough-samples", counters: c };
    }

    const failRate = c.fail / total;
    const banRate = c.ban / total;

    if (failRate > this.opts.errorRateLimit || banRate > this.opts.banRateLimit) {
      await this.disableNow();
      return {
        disabled: true,
        reason: "rate-limit-exceeded",
        counters: c,
        failRate,
        banRate,
      };
    }

    return { disabled: false, reason: "ok", counters: c };
  }
}
