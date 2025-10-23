"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperQueue = void 0;
const retry_1 = require("./retry");
const metrics_1 = require("./metrics");
class ScraperQueue {
    constructor(store) {
        this.store = store;
    }
    async enqueueUnique(payload) {
        const d = new Date();
        const key = [payload.source, payload.seedId, payload.variant ?? "", d.toISOString().slice(0, 10)].join("|");
        return this.store.enqueueUnique({ payload, uniqueKey: key, nextRunAt: new Date(0) });
    }
    async pollAndRun(handler, opts) {
        const leaseMs = opts?.leaseMs ?? 60000;
        const hbMs = opts?.hbMs ?? 20000;
        const maxAttempts = opts?.maxAttempts ?? 5;
        const leased = await this.store.leaseOne(new Date(), leaseMs);
        if (!leased)
            return false;
        const id = leased._id;
        const start = Date.now();
        const hb = setInterval(() => this.store.heartbeat(id, new Date(), leaseMs), hbMs);
        try {
            await handler(leased);
            await this.store.finish(id, "done");
        }
        catch (e) {
            metrics_1.jobFailures.inc();
            await this.store.bumpAttempts(id);
            const attempts = (leased.attempts ?? 0) + 1;
            if (attempts >= maxAttempts) {
                await this.store.moveToDead(id, String(e?.message ?? e));
            }
            else {
                metrics_1.jobRetries.inc();
                const delay = (0, retry_1.expBackoff)(attempts);
                await this.store.finish(id, "failed", String(e?.message ?? e), delay);
            }
        }
        finally {
            clearInterval(hb);
            metrics_1.jobDuration.observe(Date.now() - start);
        }
        return true;
    }
    async refreshCounts() {
        const counts = await this.store.counts();
        const states = ["queued", "running", "done", "failed", "dead"];
        for (const s of states)
            metrics_1.jobCount.labels(s).set(counts[s] ?? 0);
    }
}
exports.ScraperQueue = ScraperQueue;
