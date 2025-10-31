// apps/price-service/scripts/snapshot-zamnesia.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UA_POOL = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
];

async function fetchWithRetries(url, tries = 4, baseDelayMs = 1200) {
  let lastErr;
  for (let attempt = 0; attempt < tries; attempt++) {
    const ua = UA_POOL[attempt % UA_POOL.length];
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": ua,
          "Accept-Language": "de-DE,de;q=0.9,en;q=0.8"
        },
        timeout: 30000
      });
      if (res.status === 429 || res.status >= 500) {
        const wait = baseDelayMs * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      const wait = baseDelayMs * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr ?? new Error("fetchWithRetries failed");
}

const url = process.argv[2] || "https://www.zamnesia.com/de/420-cannabis-seeds";
const outDir = path.resolve(__dirname, "../tests/fixtures/zamnesia");
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "zamnesia-snapshot.html");

const res = await fetchWithRetries(url);
const html = await res.text();

writeFileSync(outFile, html, "utf8");
console.log("[snapshot-zamnesia] wrote", outFile);
