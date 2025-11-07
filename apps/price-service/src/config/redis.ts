// apps/price-service/src/config/redis.ts
type RedisLike = {
  get(key: string): Promise<string | null>;
  set(key: string, val: string): Promise<void>;
  setex(key: string, ttlSec: number, val: string): Promise<void>;
};

class InMemoryRedis implements RedisLike {
  private store = new Map<string, { v: string; exp?: number }>();

  async get(key: string): Promise<string | null> {
    const e = this.store.get(key);
    if (!e) return null;
    if (e.exp && e.exp < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return e.v;
  }

  async set(key: string, val: string): Promise<void> {
    this.store.set(key, { v: val });
  }

  async setex(key: string, ttlSec: number, val: string): Promise<void> {
    const exp = Date.now() + ttlSec * 1000;
    this.store.set(key, { v: val, exp });
  }
}

export const redis = new InMemoryRedis();
