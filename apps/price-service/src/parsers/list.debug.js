/* Debug-Runner: immer valides JSON, ohne cheerio. */
const fs = require("fs");

function extractAnchorsRegex(html, base){
  const out = [];
  const hrefRe = /(product|products|seed|strain|shop|artikel|produkt|\/collections\/|\/catalog\/|\/category\/|\/tienda\/|\/shop\/)/i;
  // naive Anchor-Extraktion
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] || "";
    if(!hrefRe.test(href)) continue;
    // Text säubern
    const text = m[2].replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
    if(!text || text.length < 3) continue;
    let url = href;
    try { url = new URL(href, base || "https://example.com").toString(); } catch {}
    out.push({ name: text, url, source: "anchor" });
    if(out.length >= 2000) break; // harte Grenze, falls Seite riesig ist
  }
  return out;
}

(function main(){
  try{
    const file = process.argv[2];
    const base = process.argv[3];
    if(!file){ process.stdout.write("[]"); return; }
    const html = fs.readFileSync(file, "utf8");
    const items = extractAnchorsRegex(html, base);
    process.stdout.write(JSON.stringify(items));
  } catch {
    process.stdout.write("[]");
  }
})();
