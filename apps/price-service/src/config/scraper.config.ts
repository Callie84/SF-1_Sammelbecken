// Produktionsreife DefaultÃ¢â‚¬â€˜Konfiguration (keine Secrets)
export type SeedbankKey =
| 'zamnesia' | 'rqs' | 'sensiseeds' | 'barneysfarm' | 'dutchpassion' | 'fastbuds' | 'generic';


export interface SeedbankConfig {
enabled: boolean;
baseUrl: string;
maxConcurrency: number; // Seiten parallel
requestDelayMs: number; // Zeit zwischen Requests
timeoutMs: number; // Page Timeout
retries: number; // Versuche pro Schritt
window: string; // CronÃ¢â‚¬â€˜ÃƒÂ¤hnlich, z.Ã¢â‚¬Â¯B. "0-6,22-24" Uhr
robotsTtlSec: number; // Cache robots.txt
userAgents: string[]; // Rotation
}


export const SCRAPER_CONFIG: Record<SeedbankKey, SeedbankConfig> = {
zamnesia: {
enabled: true,
baseUrl: 'https://www.zamnesia.com',
maxConcurrency: 2,
requestDelayMs: 3000,
timeoutMs: 30000,
retries: 3,
window: '0-6,20-24',
robotsTtlSec: 86400,
userAgents: [
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
],
},
rqs: {
enabled: true,
baseUrl: 'https://www.royalqueenseeds.com',
maxConcurrency: 2,
requestDelayMs: 2500,
timeoutMs: 30000,
retries: 3,
window: '0-6,20-24',
robotsTtlSec: 86400,
userAgents: [
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
],
},
sensiseeds: { enabled: true, baseUrl: 'https://sensiseeds.com', maxConcurrency: 1, requestDelayMs: 4000, timeoutMs: 35000, retries: 3, window: '0-6,22-24', robotsTtlSec: 86400, userAgents: ['Mozilla/5.0 ...'] },
barneysfarm: { enabled: true, baseUrl: 'https://www.barneysfarm.com', maxConcurrency: 1, requestDelayMs: 4000, timeoutMs: 35000, retries: 3, window: '0-6,22-24', robotsTtlSec: 86400, userAgents: ['Mozilla/5.0 ...'] },
dutchpassion: { enabled: true, baseUrl: 'https://dutch-passion.com', maxConcurrency: 1, requestDelayMs: 4000, timeoutMs: 35000, retries: 3, window: '0-6,22-24', robotsTtlSec: 86400, userAgents: ['Mozilla/5.0 ...'] },
fastbuds: { enabled: true, baseUrl: 'https://2fast4buds.com', maxConcurrency: 1, requestDelayMs: 4000, timeoutMs: 35000, retries: 3, window: '0-6,22-24', robotsTtlSec: 86400, userAgents: ['Mozilla/5.0 ...'] },
generic: { enabled: false, baseUrl: '', maxConcurrency: 1, requestDelayMs: 5000, timeoutMs: 30000, retries: 2, window: '1-5', robotsTtlSec: 43200, userAgents: ['Mozilla/5.0 ...'] },
};