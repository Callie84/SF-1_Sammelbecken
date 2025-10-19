import { chromium } from "playwright-chromium";
import { writeFileSync } from "node:fs";

const url = process.argv[2] || "https://www.zamnesia.com/us/295-feminized-seeds";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  userAgent: "Mozilla/5.0",
  locale: "de-DE",
  extraHTTPHeaders: { "Accept-Language": "de-DE,de;q=0.9,en;q=0.8" }
});
const page = await ctx.newPage();

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

const tryClick = async (selOrText) => {
  try {
    const el = await page.waitForSelector(selOrText, { timeout: 2000 });
    if (el) await el.click();
  } catch {}
};
await tryClick('button:has-text("Accept")');
await tryClick('button:has-text("Alle akzeptieren")');
await tryClick('button:has-text("Enter")');
await tryClick('text=I accept the');
await tryClick('button:has-text("OK")');

await page.waitForFunction(() => {
  return Array.from(document.querySelectorAll('a'))
    .filter(a => a.href.includes('/us/') && a.href.endsWith('.html')).length >= 12;
}, { timeout: 15000 });

await page.evaluate(async () => {
  for (let i = 0; i < 5; i++) { window.scrollBy(0, 1200); await new Promise(r => setTimeout(r, 500)); }
});

const links = await page.evaluate(() => Array.from(new Set(
  Array.from(document.querySelectorAll('a'))
    .map(a => a.href)
    .filter(h => h.includes('/us/') && h.endsWith('.html'))
)));
console.log("ProductLinkCount:", links.length);

await page.waitForLoadState("networkidle").catch(()=>{});
const html = await page.content();
await browser.close();

writeFileSync("tests/fixtures/zamnesia.list.html", html, "utf8");
console.log("Fixture aktualisiert: tests/fixtures/zamnesia.list.html");
