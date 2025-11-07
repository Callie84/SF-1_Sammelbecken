export type ScraperJobState = "queued" | "running" | "done" | "failed" | "dead";
export interface ScraperJobPayload {
  source: string;
  seedId: string;
  variant?: string;
  url: string;
  requestedAt?: Date;
}
export interface ScraperJobDoc {
  _id?: string;
  state: ScraperJobState;
  payload: ScraperJobPayload;
  attempts: number;
  lastError?: string;
  leaseUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  uniqueKey: string;
  nextRunAt?: Date;
}
