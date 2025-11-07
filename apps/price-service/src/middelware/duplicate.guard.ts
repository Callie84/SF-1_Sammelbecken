import { redis } from '../config/redis';


export async function lock(key: string, ttlSec = 600): Promise<boolean> {
const ok = await (redis as any).setNX(`sf1:lock:${key}`, '1');
if (ok) await redis.expire(`sf1:lock:${key}`, ttlSec);
return !!ok;
}