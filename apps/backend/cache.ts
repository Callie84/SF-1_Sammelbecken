/**
 * SF-1 Redis Cache-Layer
 * - Sicher: FÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤llt Redis aus, arbeitet Backend weiter (Bypass).
 * - JSON-Helfer, TTL-Jitter gegen Stampedes.
 * ENV:
 *   REDIS_URL (optional, z.B. redis://:pass@sf1-redis:6379/0)
 *   REDIS_HOST (default: sf1-redis)
 *   REDIS_PORT (default: 6379)
 *   REDIS_PASS (von k8s Secret sf1-secrets.REDIS_PASS)
 */

import { createClient, RedisClientType } from "redis";

type Opts = { jitter?: number };

let client: RedisClientType | null = null;
let healthy = false;

function buildUrl(): string {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  const host = process.env.REDIS_HOST || "sf1-redis";
  const port = Number(process.env.REDIS_PORT || 6379);
  const pass = process.env.REDIS_PASS ? `:${encodeURIComponent(process.env.REDIS_PASS)}@` : "";
  return `redis://${pass}${host}:${port}/0`;
}

export async function connectRedis(): Promise<void> {
  if (client) return;
  const url = buildUrl();
  client = createClient({ url });
  client.on("error", (e) => {
    healthy = false;
    console.warn("[SF-1] Redis Fehler:", e?.message || e);
  });
  client.on("ready", () => {
    healthy = true;
    console.log("[SF-1] Redis verbunden");
  });
  try {
    await client.connect();
  } catch (e) {
    console.warn("[SF-1] Redis Connect fehlgeschlagen, Bypass aktiv:", (e as Error).message);
    client = null;
  }
}

function addJitter(ttl: number, jitter?: number): number {
  if (!jitter || jitter <= 0) return ttl;
  const delta = Math.floor(Math.random() * Math.min(jitter, Math.max(1, Math.floor(ttl / 5))));
  return ttl + delta;
}

export async function getJSON<T = unknown>(key: string): Promise<T | null> {
  if (!client || !healthy) return null;
  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown, ttlSec: number, opts: Opts = {}): Promise<void> {
  if (!client || !healthy) return;
  try {
    const ttl = Math.max(1, addJitter(ttlSec, opts.jitter));
    await client.set(key, JSON.stringify(value), { EX: ttl });
  } catch {
    /* no-throw */
  }
}

/**
 * Cache-Aside: holt aus Cache, sonst fetchFn(), setzt Cache, gibt Wert zurÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼ck.
 */
export async function wrapJSON<T>(
  key: string,
  ttlSec: number,
  fetchFn: () => Promise<T>,
  opts: Opts = {}
): Promise<T> {
  const cached = await getJSON<T>(key);
  if (cached !== null) return cached;
  const fresh = await fetchFn();
  // Nicht warten, wenn Redis down ist
  setJSON(key, fresh, ttlSec, opts).catch(() => void 0);
  return fresh;
}

// Auto-Connect beim Import
void connectRedis();
