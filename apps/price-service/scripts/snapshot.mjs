import { chromium } from "playwright-chromium";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [,, id, locale, url] = process.argv;
if (!id || !locale || !url) { console.error("Usage: node scripts/snapshot.mjs <id> <locale> <url>"); process.exit(2); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: locale === "de" ? "de-DE" : "en-US" });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

const clicks = [
  'button:has-text("Alle akzeptieren")','button:has-text("Akzeptieren")',
  'button:has-text("Accept")','button:has-text("OK")','button:has-text("Enter")',
  'text=I accept','text=Ich bin über 18','text=I am over 18'
];
for (const sel of clicks) { try { await page.click(sel, { timeout: 1000 }); } catch {} }

await page.evaluate(async () => { for (let i=0;i<6;i++){ window.scrollBy(0,1400); await new Promise(r=>setTimeout(r,400)); }});
await page.waitForLoadState("networkidle").catch(()=>{});

const html = await page.content();
await browser.close();

const out = `tests/fixtures/${id}.${locale}.list.html`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, "utf8");
console.log(`Fixture aktualisiert: ${out}`);
