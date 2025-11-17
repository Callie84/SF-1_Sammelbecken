import fs from "node:fs";
import path from "node:path";

// JS-Version des Parsers (keine TS-Imports nötig)
function parsePrice(raw){
  const txt = String(raw||"").replace(/\u00A0/g," ").trim();
  const m = txt.match(/(?:\b(EUR|USD|GBP|CHF)\b|[$£]|CHF)?\s*([\d]+(?:[.,\s][\d]{3})*(?:[.,][\d]{2})?|[\d]+)\s*(?:\b(EUR|USD|GBP|CHF)\b|[$£]|CHF)?/i);
  if(!m) return { price:null, currency:null };
  const pre = (m[1]||"").toUpperCase();
  const numRaw = m[2].replace(/\s/g,"");
  const post = (m[3]||"").toUpperCase();
  const currency = (pre||post||"").replace("","EUR").replace("$","USD").replace("£","GBP");
  const hasDot = numRaw.includes(".");
  const hasComma = numRaw.includes(",");
  let norm = numRaw;
  if(hasDot && hasComma){
    const lastDot = numRaw.lastIndexOf(".");
    const lastComma = numRaw.lastIndexOf(",");
    const decIsComma = lastComma > lastDot;
    norm = numRaw.replace(/[.,]/g, (_ch, idx)=> idx=== (decIsComma?lastComma:lastDot) ? "." : "");
  } else if(hasComma && !hasDot){
    norm = numRaw.replace(/\./g,"").replace(/,/g,".");
  } else {
    norm = numRaw.replace(/\./g,"");
  }
  const price = Number.parseFloat(norm);
  if(!Number.isFinite(price)) return { price:null, currency: currency||null };
  return { price, currency: currency||null };
}

const dir = path.resolve("tests/fixtures");
let pages=0, items=0, priceHit=0, curHit=0;

if(!fs.existsSync(dir)){
  console.error(`Fixtures-Ordner fehlt: ${dir}`);
  process.exit(2);
}

for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".html"))){
  pages++;
  const html = fs.readFileSync(path.join(dir,f),"utf8");
  const matches = html.match(/([$£]|\bEUR\b|\bUSD\b|\bGBP\b|\bCHF\b)?\s*[\d][\d.,\s]*\d(?:\s*(?:EUR|USD|GBP|CHF|[$£]))?/g) || [];
  for(const raw of matches){
    items++;
    const r = parsePrice(raw);
    if(r.price!=null) priceHit++;
    if(r.currency) curHit++;
  }
}

const report = {
  pages, items,
  priceHit, curHit,
  priceRate: items? +(priceHit/items).toFixed(4) : 0,
  curRate:    items? +(curHit/items).toFixed(4)   : 0
};
console.log(JSON.stringify(report, null, 2));
