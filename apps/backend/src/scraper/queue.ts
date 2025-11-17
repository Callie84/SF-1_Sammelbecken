import { ObjectId } from "mongodb";
import { JobStore } from "./job.model";
import { expBackoff } from "./retry";
import { jobCount, jobDuration, jobRetries, jobFailures } from "./metrics";
import { ScraperJobDoc } from "../types/scraper";

export class ScraperQueue {
  constructor(private store: JobStore) {}

  async enqueueUnique(payload: ScraperJobDoc["payload"]) {
    const d = new Date();
    const key = [payload.source, payload.seedId, payload.variant ?? "", d.toISOString().slice(0,10)].join("|");
    return this.store.enqueueUnique({ payload, uniqueKey: key, nextRunAt: new Date(0) } as any);
  }

  async pollAndRun(handler: (doc: ScraperJobDoc) => Promise<void>, opts?: { leaseMs?: number; maxAttempts?: number; hbMs?: number }) {
    const leaseMs = opts?.leaseMs ?? 60_000;
    const hbMs = opts?.hbMs ?? 20_000;
    const maxAttempts = opts?.maxAttempts ?? 5;

    const leased = await this.store.leaseOne(new Date(), leaseMs);
    if (!leased) return false;

    const id = (leased as any)._id as ObjectId;
    const start = Date.now();
    const hb = setInterval(() => this.store.heartbeat(id, new Date(), leaseMs), hbMs);

    try {
      await handler(leased as any);
      await this.store.finish(id, "done");
    } catch (e: any) {
      jobFailures.inc();
      await this.store.bumpAttempts(id);
      const attempts = (leased.attempts ?? 0) + 1;
      if (attempts >= maxAttempts) {
        await this.store.moveToDead(id, String(e?.message ?? e));
      } else {
        jobRetries.inc();
        const delay = expBackoff(attempts);
        await this.store.finish(id, "failed", String(e?.message ?? e), delay);
      }
    } finally {
      clearInterval(hb);
      jobDuration.observe(Date.now() - start);
    }
    return true;
  }

  async refreshCounts() {
    const counts = await this.store.counts();
    const states = ["queued","running","done","failed","dead"];
    for (const s of states) jobCount.labels(s).set(counts[s] ?? 0);
  }
}
