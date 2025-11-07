import { Collection, Db, WithId, Document, ObjectId } from "mongodb";
import { ScraperJobDoc } from "../types/scraper";

export class JobStore {
  private col: Collection<ScraperJobDoc>;
  constructor(db: Db) { this.col = db.collection<ScraperJobDoc>("scraper.jobs"); }

  async ensureIndexes() {
    await this.col.createIndex({ uniqueKey: 1 } as Document, { unique: true, name: "uniq_job_per_day" });
    await this.col.createIndex({ state: 1, nextRunAt: 1 } as Document, { name: "state_nextRun" });
    await this.col.createIndex({ leaseUntil: 1 } as Document, { name: "leaseUntil" });
    await this.col.createIndex({ updatedAt: 1 } as Document, { name: "updatedAt" });
  }

  async enqueueUnique(doc: Omit<ScraperJobDoc, "_id" | "createdAt" | "updatedAt" | "attempts" | "state">) {
    const now = new Date();
    const toInsert: ScraperJobDoc = { ...doc, createdAt: now, updatedAt: now, attempts: 0, state: "queued" };
    try { await this.col.insertOne(toInsert); return { inserted: true }; }
    catch (e: any) { if ((e as any)?.code === 11000) return { inserted: false }; throw e; }
  }

  async leaseOne(now = new Date(), leaseMs = 60_000): Promise<WithId<ScraperJobDoc> | null> {
    const leaseUntil = new Date(now.getTime() + leaseMs);
    const res: any = await this.col.findOneAndUpdate(
      { state: "queued", $or: [{ nextRunAt: { $exists: false } }, { nextRunAt: { $lte: now } }] } as any,
      { $set: { state: "running", leaseUntil, updatedAt: now } } as any,
      { sort: { nextRunAt: 1, createdAt: 1 }, returnDocument: "after" } as any
    );
    return res?.value ?? null;
  }

  async heartbeat(id: ObjectId, now = new Date(), extendMs = 60_000) {
    const leaseUntil = new Date(now.getTime() + extendMs);
    await this.col.updateOne({ _id: id, state: "running" } as any, { $set: { leaseUntil, updatedAt: now } });
  }

  async finish(id: ObjectId, state: "done" | "failed", lastError?: string, delayNextMs?: number) {
    const now = new Date();
    const set: any = { updatedAt: now, state, lastError };
    if (state === "failed" && typeof delayNextMs === "number") set.nextRunAt = new Date(now.getTime() + delayNextMs);
    await this.col.updateOne({ _id: id } as any, { $set: set });
  }

  async bumpAttempts(id: ObjectId) { await this.col.updateOne({ _id: id } as any, { $inc: { attempts: 1 } }); }

  async moveToDead(id: ObjectId, err: string) {
    const now = new Date();
    await this.col.updateOne({ _id: id } as any, { $set: { state: "dead", lastError: err, updatedAt: now } });
  }

  async requeueOrphans(now = new Date()) {
    const r = await this.col.updateMany(
      { state: "running", leaseUntil: { $lt: now } } as any,
      { $set: { state: "queued" }, $unset: { leaseUntil: "" } }
    );
    return r.modifiedCount;
  }

  async counts() {
    const rows = await this.col.aggregate([{ $group: { _id: "$state", n: { $sum: 1 } } }]).toArray();
    const out: Record<string, number> = {}; for (const r of rows) out[r._id] = r.n; return out;
  }
}
