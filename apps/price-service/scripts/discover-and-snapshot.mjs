import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

function readJsonNoBom(p) {
  const raw = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}
function slug(s="") {
  return String(s).toLowerCase().replace(/^https?:\/\//,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}

const rules = readJsonNoBom(path.join("config","rules.json"));
let clicks = [];
try {
  clicks = readJsonNoBom(path.join("config","clicks.json"));
} catch {
  clicks = [
    'text=/accept/i','text=/alle akzeptieren/i','text=/akzeptieren/i',
    'button:has-text("Accept")','[id*="accept"]','[data-testid*="consent"]',
    'text=/agree/i','text=/weiter/i','text=/close/i'
  ];
}

async function findCategory(page){
  const anchors = await page.$$eval("a", as => as.map(a=>({ href: a.href || "", t: (a.textContent||"").trim() })));
  const re = /(femini(?:s|z)(?:ed|ed)|feminised|feminized|feminizadas|fem|feminizadas|feminizate)/i;
  const hit = anchors.find(a => re.test(a.t) || re.test(a.href));
  return hit?.href || null;
}

async function snapshotOne({ id, startUrl }){
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    locale: "en-US",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  });
  const page = await ctx.newPage();

  try {
    await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(()=>{});
    // Consent / „mehr laden“
    for (const sel of clicks) { try { await page.click(sel, { timeout: 1200 }); } catch {} }

    let target = startUrl;
    if (!/[\/-](fem|feminized|feminised)/i.test(startUrl)) {
      const cat = await findCategory(page);
      if (cat) target = cat;
    }
    if (target !== page.url()) {
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(()=>{});
    }

    // Lazy content laden
    await page.evaluate(async () => {
      for (let i = 0; i < 8; i++) {
        window.scrollBy(0, 1600);
        await new Promise(r => setTimeout(r, 450));
      }
    });
    await page.waitForLoadState("networkidle").catch(()=>{});

    const html = await page.content();
    fs.writeFileSync(path.join("tests","fixtures", `${id}.auto.list.html`), html, "utf8");
    console.log(`Fixture aktualisiert: tests/fixtures/${id}.auto.list.html`);
  } catch (e) {
    console.log(`ERR ${id}: ${e?.message||e}`);
  } finally {
    await ctx.close().catch(()=>{});
    await browser.close().catch(()=>{});
  }
}

(async () => {
  const list = Array.isArray(rules.seedbanks) ? rules.seedbanks : (rules || []);
  for (const r of list) {
    const id = r.id || slug(r.start || r.domain || "");
    const startUrl = r.start || r.url || "";
    if (!startUrl) { console.log(`SKIP: ${id} (keine start-URL)`); continue; }
    await snapshotOne({ id, startUrl });
  }
})();
