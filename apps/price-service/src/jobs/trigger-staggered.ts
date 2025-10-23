import { Queue } from 'bullmq';
import { redis } from '../config/redis';
import { SCRAPER_CONFIG } from '../config/scraper.config';


const q = new Queue('scraper-queue', { connection: redis as any });


(async () => {
const now = new Date();
const hour = now.getHours();


const toRun = Object.entries(SCRAPER_CONFIG)
.filter(([, c]) => c.enabled)
.filter(([, c]) => inWindow(hour, c.window))
.map(([k, c]) => ({ key: k, delay: c.requestDelayMs }));


let offset = 0;
for (const sb of toRun) {
await q.add(
'scrape-full',
{ seedbank: sb.key, type: 'full' },
{ delay: offset, attempts: 1, removeOnComplete: true, removeOnFail: false }
);
offset += 60_000; // eine Minute staffeln
}
process.exit(0);
})();


function inWindow(hour: number, window: string): boolean {
// Format "0-6,20-24" Ã¢â€ â€™ true/false
return window.split(',').some(r => {
const [a, b] = r.split('-').map(n => parseInt(n, 10));
return hour >= a && hour <= b;
});
}