/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from "cheerio";

export type ListItem = {
  name: string;
  url?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
  sku?: string;
  id?: string;
  source: "jsonld" | "microdata" | "json" | "dom" | "fallback" | "anchor";
};

const CURRENCIES = ["EUR","USD","GBP","CHF","CAD","AUD","SEK","NOK","DKK","JPY","PLN","CZK","HUF"];
const CUR_MAP: Record<string,string> = { "":"EUR", "$":"USD", "£":"GBP" };

function toAbsUrl(href?: string, base?: string){ if(!href) return undefined; try{ return new URL(href, base).toString(); }catch{ return href; } }
function pick<T>(...v:(T|undefined|null)[]){ for(const x of v){ if(x!==undefined && x!==null && x!=="") return x as T; } }
function normName(s?: string){ if(!s) return; const t=s.replace(/\u00A0/g," ").replace(/\s+/g," ").trim(); return t||undefined; }
function dedupe(items: any[]){ const seen=new Set<string>(); const out:any[]=[]; for(const it of items){ const k=(it.name||"").toLowerCase()+"|"+(it.url||"").toLowerCase(); if(seen.has(k)) continue; seen.add(k); out.push(it);} return out; }
function parseMoney(raw?: string){ if(!raw) return {}; const s=raw.replace(/\s+/g," ").trim();
  const curSym = Object.keys(CUR_MAP).find(k=>k!=="" && s.includes(k)); let currency = curSym?CUR_MAP[curSym]:undefined;
  if(!currency){ const mCur=s.match(new RegExp("\\b(" + CURRENCIES.join("|") + ")\\b","i")); if(mCur) currency=mCur[1].toUpperCase(); }
  const num=s.replace(/[^\d,.\s]/g,"").replace(/\s/g,"").replace(/(\d+)[.,](\d{3})([.,]\d{2})?$/,"$1$2$3");
  const m=num.match(/(\d+[.,]\d{2}|\d+)/); const val=m?parseFloat(m[1].replace(/\./g,"").replace(",", ".")):undefined;
  return { price: Number.isFinite(val)?val:undefined, currency: currency ?? (s.includes("€")?"EUR":undefined) };
}

/* -------- JSON-LD -------- */
function priceFromOffer(offer: any){
  if(!offer) return {};
  const spec = offer.priceSpecification || {};
  const isAgg = String(offer["@type"]||"").toLowerCase().includes("aggregateoffer");
  const {price, currency} = parseMoney(offer.price ?? spec.price ?? (isAgg? (offer.lowPrice ?? offer.highPrice): undefined) ?? offer.priceCurrency);
  const avail = String(offer.availability || spec.availability || "").toLowerCase();
  const inStock = /instock|preorder|limited/.test(avail) ? true : /outofstock/.test(avail) ? false : undefined;
  return {price, currency, inStock};
}

function harvestJsonLd($: cheerio.CheerioAPI, base?: string){
  const out:any[]=[];
  $('script[type="application/ld+json"]').each((_,el)=>{
    const txt=$(el).contents().text().trim(); if(!txt) return;
    try{
      const parsed=JSON.parse(txt);
      const nodes:any[] = Array.isArray(parsed)?parsed:(parsed && Array.isArray(parsed["@graph"]))?parsed["@graph"]:[parsed];
      for(const n of nodes){
        const t=String(n && (n["@type"]||n.type)||"").toLowerCase();
        if(t.includes("itemlist") && Array.isArray(n.itemListElement)){
          for(const li of n.itemListElement){
            const item=li?.item ?? li;
            const name=normName(item?.name || li?.name); if(!name) continue;
            const url=toAbsUrl(item?.url || item?.["@id"] || li?.url, base);
            const p=priceFromOffer(item?.offers || n.offers);
            out.push({name,url,price:p.price,currency:p.currency,inStock:p.inStock,sku:pick(item?.sku,item?.mpn),id:pick(item?.gtin,item?.gtin13,item?.gtin12,item?.gtin14),source:"jsonld"});
          }
        }
        if(t.includes("product")){
          const prods=Array.isArray(n)?n:[n];
          for(const prod of prods){
            const name=normName(prod?.name); if(!name) continue;
            const url=toAbsUrl(prod?.url || prod?.["@id"], base);
            const p=priceFromOffer(Array.isArray(prod?.offers)?prod.offers[0]:prod?.offers);
            out.push({name,url,price:p.price,currency:p.currency,inStock:p.inStock,sku:pick(prod?.sku,prod?.mpn),id:pick(prod?.gtin,prod?.gtin13,prod?.gtin12,prod?.gtin14),source:"jsonld"});
          }
        }
      }
    }catch{}
  });
  return out;
}

/* -------- Microdata -------- */
function harvestMicrodata($: cheerio.CheerioAPI, base?: string){
  const out:any[]=[];
  $('[itemscope][itemtype]').each((_,scope)=>{
    const type=($(scope).attr("itemtype")||"").toLowerCase();
    if(!/product|listitem|offer/.test(type)) return;
    const get=(prop:string)=>{ const el=$(scope).find(`[itemprop="${prop}"]`).first(); if(!el.length) return; const tag=(el.prop("tagName")||"").toLowerCase();
      if(tag==="meta") return el.attr("content")||undefined; if(tag==="img") return el.attr("alt")||el.attr("content")||undefined; if(tag==="a") return el.attr("href")||el.text(); return el.text(); };
    const name=normName(get("name") || $(scope).find("a, h2, h3").first().text()); if(!name) return;
    const url=toAbsUrl(get("url") || $(scope).find("a[itemprop=url], a").first().attr("href"), base);
    const {price,currency}=parseMoney(get("price") || get("priceCurrency") || $(scope).find('[itemprop="price"]').first().text());
    const avail=String(get("availability")||"").toLowerCase();
    const inStock=/instock|preorder|limited/.test(avail)?true:/outofstock/.test(avail)?false:undefined;
    out.push({name,url,price,currency,inStock,sku:get("sku")||undefined,id:pick(get("gtin"),get("gtin13"),get("gtin12"),get("gtin14")),source:"microdata"});
  });
  return out;
}

/* -------- JSON-Blobs -------- */
function tryParseAssignedJSON(txt:string):any[]{ const out:any[]=[]; const assigns=(txt.match(/=\s*{[\s\S]+?};?/g)||[]).map(s=>{const i=s.indexOf("{"), j=s.lastIndexOf("}"); return i>=0&&j>i?s.slice(i,j+1):"";}).filter(Boolean);
  const raw = txt.indexOf("{")>=0 ? txt.slice(txt.indexOf("{")) : "";
  if(raw) assigns.push(raw);
  for(const c of assigns){ try{ out.push(JSON.parse(c)); }catch{} }
  return out;
}
function harvestJsonBlobs($: cheerio.CheerioAPI, base?: string){
  const out:any[]=[];
  $('script').each((_,el)=>{
    const type=(($(el).attr("type"))||"").toLowerCase();
    const txt=$(el).contents().text(); if(!txt || txt.length<20) return;
    const visit=(node:any)=>{ if(!node) return; if(Array.isArray(node)){ node.forEach(visit); return; } if(typeof node!=="object") return;
      const buckets:any[]=[]; if(node.products) buckets.push(node.products); if(node.items) buckets.push(node.items);
      if(node.list||node.catalog) buckets.push(node.list||node.catalog); if(node.props?.pageProps) buckets.push(node.props.pageProps);
      if(node.data) buckets.push(node.data); if(node.product||node.productInfo) buckets.push(node.product||node.productInfo); for(const b of buckets) visit(b);
      const name=normName((node.name||node.title||node.productName||node.heading) as string);
      if(name){ const {price,currency}=parseMoney(String(node.price??node.priceText??node.amount??node.cost??node.offerPrice??""));
        const url=toAbsUrl((node.url||node.link||node.href) as string, base);
        out.push({name,url,price,currency,inStock:pick<boolean>(node.available??node.inStock??node.stock),sku:pick<string>(node.sku,node.mpn,node.id),id:pick<string>(node.gtin,node.gtin13,node.gtin12,node.gtin14),source:"json"}); }
      for(const k of Object.keys(node)){ visit((node as any)[k]); }
    };
    if(!type || type==="application/json" || type==="text/plain"){ try{ visit(JSON.parse(txt)); }catch{ for(const o of tryParseAssignedJSON(txt)) visit(o); } }
    else { for(const o of tryParseAssignedJSON(txt)) visit(o); }
  });
  return out;
}

/* -------- DOM -------- */
function harvestDom($: cheerio.CheerioAPI, base?: string){
  const out:any[]=[];
  const selectors=[
    'li.product, article.product, .product, .product-card, .product-item, .product-list-item, .product-box, .product__item',
    '[data-product], [data-sku], [data-item], [data-product-id], [data-testid*="product"]',
    '.grid-item, .catalog-item, .listing-item, .collection-product, .productTeaser'
  ];
  $(selectors.join(",")).each((_,el)=>{
    const root=$(el);
    const a=root.find("a[href]").first();
    const url=toAbsUrl(a.attr("href"), base);
    const name=normName(
      root.find("[itemprop='name']").first().text() ||
      root.find("h1, h2, h3, .title, .product-title, .card-title, .name").first().text() ||
      a.text()
    );
    const priceRaw =
      root.find("[itemprop='price']").first().text() ||
      root.find(".price, .product-price, .amount, .value, [data-price], .money").first().text() ||
      root.text();
    const {price,currency}=parseMoney(priceRaw);
    if(name){ out.push({name,url,price,currency,source:"dom"}); }
  });
  return out;
}

/* -------- Anchor-Heuristik -------- */
function getAnchorName($: cheerio.CheerioAPI, a: cheerio.Element){
  const el=$(a);
  const direct = normName(el.text());
  const title = normName(el.attr("title"));
  const aria = normName(el.attr("aria-label"));
  const dataName = normName(el.attr("data-name")||el.attr("data-title"));
  const imgAlt = normName(el.find("img[alt]").first().attr("alt"));
  const nestedName = normName(el.find("[itemprop='name'], .title, .product-title, h1, h2, h3").first().text());
  const nearby = normName(el.closest("li, article, .card, .product, .grid-item, .item, .tile").find("h1, h2, h3, .title, .product-title, [itemprop='name']").first().text());
  return pick(direct, title, aria, dataName, imgAlt, nestedName, nearby);
}
function harvestAnchorsHeuristic($: cheerio.CheerioAPI, base?: string){
  const out:any[] = [];
  const hrefRe = /(product|products|seed|strain|shop|artikel|produkt|\/collections\/|\/catalog\/|\/category\/|\/tienda\/|\/shop\/|\/brand\/|\/collections\/.*\/products\/|\.html)/i;
  $("a[href]").each((_, a) => {
    const href = ($(a).attr("href") || "").trim();
    if (!hrefRe.test(href)) return;
    const name = getAnchorName($, a);
    if (!name || name.length < 3) return;
    const url = toAbsUrl(href, base);
    out.push({ name, url, source: "anchor" });
    if (out.length >= 2000) return false as unknown as void;
  });
  return out;
}

/* -------- Raw-Anchor-Regex (Fallback) -------- */
function harvestAnchorsRegexRaw(html: string, base?: string){
  const out:any[] = [];
  const hrefRe = /(product|products|seed|strain|shop|artikel|produkt|\/collections\/|\/catalog\/|\/category\/|\/tienda\/|\/shop\/|\/brand\/|\/collections\/.*\/products\/|\.html)/i;
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] || "";
    if (!hrefRe.test(href)) continue;
    const text = (m[2] || "").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
    if (!text || text.length < 3) continue;
    const url = toAbsUrl(href, base);
    out.push({ name: text, url, source: "anchor" });
    if (out.length >= 2000) break;
  }
  return out;
}

/* -------- Preis-Fallback -------- */
function harvestPriceFallback($: cheerio.CheerioAPI, base?: string){
  const out:any[]=[];
  const priceNodes = $('*:contains("€"), *:contains("$"), *:contains("£")').filter((_,e)=>{
    const t = ($(e).text()||"").replace(/\s+/g," ").trim();
    return /(\d+[.,]\d{2}|\d+)\s*(€|EUR|\$|USD|£|GBP)/i.test(t);
  }).slice(0, 300);
  priceNodes.each((_,e)=>{
    const node=$(e); const priceText=node.text(); const {price,currency}=parseMoney(priceText); if(price===undefined && !currency) return;
    let name = normName(node.closest("li, article, .product, .card, .item, .tile").find("h1, h2, h3, .title, .product-title, a").first().text());
    if(!name){ name = normName(node.prevAll("h1, h2, h3, .title").first().text() || node.parent().find("a").first().text()); }
    if(!name) return;
    const url = toAbsUrl(node.closest("li, article, .product, .card, .item, .tile").find("a[href]").first().attr("href"), base);
    out.push({ name, url, price, currency, source:"fallback" });
  });
  return out;
}

/* -------- Main -------- */
export function parseList(html: string, baseUrl?: string){
  const $ = cheerio.load(html, { decodeEntities: true });
  let items:any[]=[];
  try{ items = items.concat(harvestJsonLd($, baseUrl)); }catch{}
  try{ items = items.concat(harvestMicrodata($, baseUrl)); }catch{}
  try{ items = items.concat(harvestJsonBlobs($, baseUrl)); }catch{}
  try{ items = items.concat(harvestDom($, baseUrl)); }catch{}
  try{ items = items.concat(harvestAnchorsHeuristic($, baseUrl)); }catch{}
  if(items.length===0){ try{ items = items.concat(harvestPriceFallback($, baseUrl)); }catch{} }
  if(items.length===0){ try{ items = items.concat(harvestAnchorsRegexRaw(html, baseUrl)); }catch{} }
  items = items.filter(x=>!!x?.name);
  return dedupe(items);
}

export function extract(html: string){ return parseList(html); }
export default parseList;
