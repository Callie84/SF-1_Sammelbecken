import { chromium } from "playwright-chromium";
import { writeFileSync } from "node:fs";

const url = "https://www.zamnesia.com/de/556-feminized-seeds";
const browser = await chromium.launch();
const page = await (await browser.newContext({ locale: "de-DE" })).newPage();

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

// Cookie-/Altersbanner wegklicken
for (const sel of [
  'button:has-text("Alle akzeptieren")',
  'button:has-text("Akzeptieren")',
  'button:has-text("OK")',
  'button:has-text("Enter")'
]) {
  try { await page.click(sel, { timeout: 1500 }); } catch {}
}

// Etwas scrollen, um Lazy-Content zu laden
await page.evaluate(async () => {
  for (let i = 0; i < 6; i++) {
    window.scrollBy(0, 1400);
    await new Promise(r => setTimeout(r, 400));
  }
});

const html = await page.content();
await browser.close();

writeFileSync("tests/fixtures/zamnesia.de.list.html", html, "utf8");
console.log("Fixture aktualisiert: tests/fixtures/zamnesia.de.list.html");
