import * as cheerio from "cheerio";

type Item = { name:string; price:number|null; currency:string|null; url:string|null };


function cleanName(t?: string | null){
  const s = (t||"").trim();
  return s.startsWith("Read More about ") ? s.replace(/^Read More about\s+/,"") : s;
}
function norm(t?:string|null){ return (t||"").replace(/\s+/g," ").trim(); }

function parsePrice(raw:string){
  const cleaned = (raw||"").replace(/\u00A0/g," ").trim();
  // WICHTIG:  korrekt erfassen, kein leerer Alternativ-Arm
  const m = cleaned.match(/([\d.,]+)\s*(|\$|£|usd|eur|gbp)?/i);
  if(!m) return { price:null, currency:null };
  const num = m[1].replace(/\./g,"").replace(/,/g,".");
  const sym = (m[2]||"").toUpperCase();
  let currency: string|null = null;
  if(sym === "") currency = "EUR";
  else if(sym === "$" || sym === "USD") currency = "USD";
  else if(sym === "£" || sym === "GBP") currency = "GBP";
  else if(cleaned.includes("")) currency = "EUR";
  else if(cleaned.includes("$")) currency = "USD";
  else if(/usd/i.test(cleaned)) currency = "USD";
  else if(/eur/i.test(cleaned)) currency = "EUR";
  return { price: isNaN(Number(num)) ? null : Number(num), currency };
}

function uniq(items:Item[]):Item[]{
  const seen = new Set<string>(), out:Item[]=[];
  for(const it of items){
    const k = `${it.name}|${it.price}|${it.currency}|${it.url||""}`;
    if(it.name && !seen.has(k)){ seen.add(k); out.push(it); }
  }
  return out;
}

function fromJsonLd($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  $('script[type="application/ld+json"]').each((_,el)=>{
    const txt = $(el).text();
    try{
      const data = JSON.parse(txt);
      const arr = Array.isArray(data) ? data : [data];
      for(const d of arr){
        const t = String(d?.["@type"]||d?.type||"").toLowerCase();
        const list:any[] = [];
        if(t.includes("product")) list.push(d);
        if(t.includes("itemlist") && Array.isArray(d.itemListElement)){
          for(const it of d.itemListElement){
            const v = it?.item ?? it;
            if(v && String(v["@type"]||"").toLowerCase().includes("product")) list.push(v);
          }
        }
        for(const p of list){
          let name = cleanName(norm(p.name || p.brand || p.sku || p.description));
if(name.startsWith("Read More about ")) { name = name.replace(/^Read More about\s+/,""); }
          const priceRaw = String(p.offers?.price ?? p.price ?? p.offers?.priceSpecification?.price ?? "");
          const curRaw   = String(p.offers?.priceCurrency ?? p.priceCurrency ?? "");
          const { price, currency } = priceRaw ? parsePrice(priceRaw + " " + curRaw) : { price:null, currency: curRaw || null };
          const url = p.url || p.offers?.url || null;
          if(name) out.push({ name: cleanName(name), price, currency, url });
        }
      }
    }catch{}
  });
  return out;
}

function fromMicrodata($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  $('[itemscope]').each((_,el)=>{
    const type = String($(el).attr('itemtype')||"").toLowerCase();
    if(!type.includes("product")) return;
    const $el = $(el);
    const name = norm(
      $el.find('[itemprop="name"]').first().text() ||
      $el.find('a[title], h2, h3, .title').first().text()
    );
    let priceRaw = $el.find('[itemprop="price"]').first().attr('content')
                   || $el.find('[itemprop="price"]').first().text();
    priceRaw = norm(priceRaw||"");
    const cur = $el.find('[itemprop="priceCurrency"]').first().attr('content') || null;
    const { price, currency } = parsePrice((priceRaw||"") + " " + (cur||""));
    let url = $el.find('a[href]').first().attr('href') || null;
    if(url && url.startsWith("//")) url = "https:" + url;
    if(name) out.push({ name: cleanName(name), price, currency, url });
  });
  return out;
}



export default function extract(html:string):Item[]{
  const $ = cheerio.load(html);
  let items = fromJsonLd($);
if(items.length===0) items = fromMicrodata($);
if(items.length===0) items = fromAppState($);
if(items.length===0) items = fromGenericCss($);
if(items.length===0) items = fromHeuristic($);
return uniq(items);
'

Set-Content -Encoding UTF8 $path $src


Set-Location "C:\Users\kling\Desktop\SF-1_Sammelbecken\apps\price-service"

@'
import { readFileSync, writeFileSync } from "node:fs";

const file = ".\\src\\scrapers\\extract.ts";
let s = readFileSync(file,"utf8");

// Heuristik: Währungsregex korrigieren
// vorh.: const CUR=/|\$|eur|usd/i;   -> falsch wegen leerer Alternative und fehlendem 
s = s.replace(/const\s+CUR\s*=\s*[^;]+;/, 'const CUR=/(|\\$|eur|usd)/i;');

// Heuristik: Doppelprüfung entfernen
// vorh.: if(!CUR.test(t) && !/|\$/.test(t)) return;
s = s.replace(/if\(\s*!CUR\.test\(t\)\s*&&\s*!\s*\/[^\/]*\/\.test\(t\)\s*\)\s*return;/, 'if(!CUR.test(t)) return;');

// Selektoren-Syntax absichern: fehlende Klammern/Quotes vermeiden
s = s.replace(/const\s+selectors\s*=\s*\[[\s\S]*?\];/, `const selectors = [
  ".product",".product-item",".product-card",".productGrid .product",
  "li.product","article.product","div[class*\\"product\\"]",
  ".grid-item",".card:has([class*\\"price\\"])",
  ".productbox",".product_box",".product-tile",".product-list-item",
  ".collection-product",".product-card__info",".product-card__content",
  ".product-grid-item",".productItem",".prod__item",".product__item",
  "ul.products li.product",".woocommerce ul.products li.product",
  ".woocommerce-LoopProduct-link",".products .product",
  ".card-information",".card-wrapper","a.full-unstyled-link",
  ".product-grid--item",".grid-product",".grid-product__content",
  ".product-item__info",".price__regular",".price-item"
];`);

// Aufrufkette sicherstellen
s = s.replace(
/let items = fromJsonLd\(\$\)[\s\S]*?return uniq\(items\);/,
`let items = fromJsonLd($);
if(items.length===0) items = fromMicrodata($);
if(items.length===0) items = fromAppState($);
if(items.length===0) items = fromGenericCss($);
if(items.length===0) items = fromHeuristic($);
return uniq(items);`
);

writeFileSync(file, s, "utf8");
console.log("patched extract.ts");
}




function pickPrice(v:any): {price:number|null,currency:string|null}{
  if(!v) return {price:null,currency:null};
  const candidates:any[]=[
    v.price, v.price_min, v.priceMin, v.priceValue, v.priceV2?.amount,
    v.compare_at_price, v.compareAtPrice, v?.variants?.[0]?.price,
    v?.offers?.price, v?.prices?.price
  ].filter(x=>x!=null);
  const raw = String(candidates[0] ?? "");
  return parsePrice(raw);
}

function fromAppState($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  const scripts = $('script').map((_,el)=>$(el).text()).get();

  for(const txt of scripts){
    // Next.js
    const mNext = txt.match(/__NEXT_DATA__\s*=\s*(\{[\s\S]*?\})/);
    if(mNext){
      try{
        const data = JSON.parse(mNext[1]); const stack:any[]=[data];
        while(stack.length){
          const cur=stack.pop();
          if(Array.isArray(cur)){
            for(const p of cur){
              if(p && (p.title||p.name) && (p.price||p.priceMin||p?.variants?.[0]?.price)){
                const name = cleanName(norm(String(p.title||p.name)));
                const {price,currency}=pickPrice(p);
                const url = p.url || (p.handle?`/${p.handle}`:null);
                if(name) out.push({name,price,currency,url});
              }
              if(p && typeof p==='object') stack.push(p);
            }
          }else if(cur && typeof cur==='object'){
            for(const k of Object.keys(cur)) stack.push(cur[k]);
          }
        }
      }catch{}
    }
    // Nuxt
    const mNuxt = txt.match(/__NUXT__\s*=\s*(\{[\s\S]*?\})/);
    if(mNuxt){
      try{
        const data = JSON.parse(mNuxt[1]); const stack:any[]=[data];
        while(stack.length){
          const cur=stack.pop();
          if(Array.isArray(cur)){
            for(const p of cur){
              if(p && (p.title||p.name) && (p.price||p.priceMin||p?.variants?.[0]?.price)){
                const name = cleanName(norm(String(p.title||p.name)));
                const {price,currency}=pickPrice(p);
                const url = p.url || (p.slug?`/${p.slug}`:null);
                if(name) out.push({name,price,currency,url});
              }
              if(p && typeof p==='object') stack.push(p);
            }
          }else if(cur && typeof cur==='object'){
            for(const k of Object.keys(cur)) stack.push(cur[k]);
          }
        }
      }catch{}
    }
    // Shopify Streudaten
    if(/Shopify/i.test(txt)){
      const jsons = txt.match(/\{[\s\S]*?\}/g) || [];
      for(const j of jsons){
        try{
          const o = JSON.parse(j);
          const stack:any[]=[o];
          while(stack.length){
            const cur=stack.pop();
            if(Array.isArray(cur)){
              for(const p of cur){
                if(p && (p.title||p.name) && (p.price||p.price_min||p?.variants?.[0]?.price)){
                  const name = cleanName(norm(String(p.title||p.name)));
                  const {price,currency}=pickPrice(p);
                  const url = p.url || (p.handle?`/${p.handle}`:null);
                  if(name) out.push({name,price,currency,url});
                }
                if(p && typeof p==='object') stack.push(p);
              }
            }else if(cur && typeof cur==='object'){
              for(const k of Object.keys(cur)) stack.push(cur[k]);
            }
          }
        }catch{}
      }
    }
  }
  return uniq(out);
}

function fromHeuristic($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  const PRICE=/(\d{1,3}([.,]\d{3})*[.,]\d{2})/;
  const CUR=/|\$|eur|usd/i;
  $('*').each((_,el)=>{
    const t = ($(el).text()||'').replace(/\s+/g,' ').trim();
    if(!PRICE.test(t)) return;
    if(!CUR.test(t) && !/|\$/.test(t)) return;
    const box = $(el).closest('li,article,div,section');
    const a = box.find('a[href]').first();
    const name = cleanName(norm(a.attr('title') || a.text() || box.find('h2,h3,.title').first().text()));
    const {price,currency}=parsePrice(t);
    const url = a.attr('href') || null;
    if(name) out.push({name,price,currency,url});
  });
  return uniq(out);
}
