import LRU from 'lru-cache';
import fetch from 'node-fetch';


const cache = new LRU<string, { allow: (p: string) => boolean; exp: number }>({ max: 128 });


export async function getRobots(baseUrl: string, ttlSec: number) {
const key = `rb:${baseUrl}`;
const now = Date.now();
const hit = cache.get(key);
if (hit && hit.exp > now) return hit.allow;


const url = new URL('/robots.txt', baseUrl).toString();
const res = await fetch(url, { timeout: 8000 as any });
const text = res.ok ? await res.text() : '';


// Minimaler Parser: DisallowÃ¢â‚¬â€˜PrÃƒÂ¤fixe
const dis: string[] = [];
text.split('\n').forEach(l => {
const m = l.match(/^\s*Disallow:\s*(\S+)/i);
if (m) dis.push(m[1]);
});


const allow = (path: string) => !dis.some(d => path.startsWith(d));
cache.set(key, { allow, exp: now + ttlSec * 1000 });
return allow;
}