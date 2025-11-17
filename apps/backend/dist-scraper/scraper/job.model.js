"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStore = void 0;
class JobStore {
    constructor(db) { this.col = db.collection("scraper.jobs"); }
    async ensureIndexes() {
        await this.col.createIndex({ uniqueKey: 1 }, { unique: true, name: "uniq_job_per_day" });
        await this.col.createIndex({ state: 1, nextRunAt: 1 }, { name: "state_nextRun" });
        await this.col.createIndex({ leaseUntil: 1 }, { name: "leaseUntil" });
        await this.col.createIndex({ updatedAt: 1 }, { name: "updatedAt" });
    }
    async enqueueUnique(doc) {
        const now = new Date();
        const toInsert = { ...doc, createdAt: now, updatedAt: now, attempts: 0, state: "queued" };
        try {
            await this.col.insertOne(toInsert);
            return { inserted: true };
        }
        catch (e) {
            if (e?.code === 11000)
                return { inserted: false };
            throw e;
        }
    }
    async leaseOne(now = new Date(), leaseMs = 60000) {
        const leaseUntil = new Date(now.getTime() + leaseMs);
        const res = await this.col.findOneAndUpdate({ state: "queued", $or: [{ nextRunAt: { $exists: false } }, { nextRunAt: { $lte: now } }] }, { $set: { state: "running", leaseUntil, updatedAt: now } }, { sort: { nextRunAt: 1, createdAt: 1 }, returnDocument: "after" });
        return res?.value ?? null;
    }
    async heartbeat(id, now = new Date(), extendMs = 60000) {
        const leaseUntil = new Date(now.getTime() + extendMs);
        await this.col.updateOne({ _id: id, state: "running" }, { $set: { leaseUntil, updatedAt: now } });
    }
    async finish(id, state, lastError, delayNextMs) {
        const now = new Date();
        const set = { updatedAt: now, state, lastError };
        if (state === "failed" && typeof delayNextMs === "number")
            set.nextRunAt = new Date(now.getTime() + delayNextMs);
        await this.col.updateOne({ _id: id }, { $set: set });
    }
    async bumpAttempts(id) { await this.col.updateOne({ _id: id }, { $inc: { attempts: 1 } }); }
    async moveToDead(id, err) {
        const now = new Date();
        await this.col.updateOne({ _id: id }, { $set: { state: "dead", lastError: err, updatedAt: now } });
    }
    async requeueOrphans(now = new Date()) {
        const r = await this.col.updateMany({ state: "running", leaseUntil: { $lt: now } }, { $set: { state: "queued" }, $unset: { leaseUntil: "" } });
        return r.modifiedCount;
    }
    async counts() {
        const rows = await this.col.aggregate([{ $group: { _id: "$state", n: { $sum: 1 } } }]).toArray();
        const out = {};
        for (const r of rows)
            out[r._id] = r.n;
        return out;
    }
}
exports.JobStore = JobStore;
