import * as cheerio from "cheerio";

export interface ParsedItem {
  name: string; breeder: string; price: number; currency: string;
  url: string; inStock: boolean; packSize?: number;
}
const n = (s:string)=>parseFloat(s.replace(/[^\d,\.]/g,"").replace(",","."))||NaN;
const cur = (s:string)=>/|eur/i.test(s)?"EUR":/\$|usd/i.test(s)?"USD":/Â£|gbp/i.test(s)?"GBP":"EUR";

export function parseZamnesiaList(html: string): ParsedItem[] {
  const $ = cheerio.load(html);
  const out: ParsedItem[] = [];

  // 1) JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).contents().text();
      const data = JSON.parse(raw);
      const arr = Array.isArray(data)?data:[data];
      for (const d of arr) {
        const prods: any[] = [];
        if (d["@type"]==="Product") prods.push(d);
        if (Array.isArray(d.itemListElement)) {
          for (const it of d.itemListElement) if (it?.item?.["@type"]==="Product") prods.push(it.item);
        }
        for (const p of prods) {
          const name = String(p.name||"").trim();
          const url  = String(p.url||p["@id"]||"").trim();
          const brand= String(p.brand?.name||p.brand||"Unknown");
          const off  = Array.isArray(p.offers)?p.offers[0]:p.offers;
          const price= n(String(off?.price ?? off?.priceSpecification?.price ?? ""));
          const currency = String(off?.priceCurrency ?? "EUR");
          const inStock = String(off?.availability ?? "").toLowerCase().includes("instock");
          if (name && url && Number.isFinite(price) && price>0)
            out.push({ name, breeder: brand, price, currency, url, inStock });
        }
      }
    } catch {}
  });

  // 2) Breite DOM-Selektoren
  const cards = $([
    ".product-item",".product","li.product",".product-card",
    ".grid-item",".catalog-grid-item","[data-product-id]",
    ".products-grid .item",".product-list .item",".product--box"
  ].join(",")).toArray();

  for (const el of cards) {
    const r = $(el);
    const a = r.find("a[href]").first();
    const url = (a.attr("href")||"").trim();
    const name = r.find(".product-name a, h2.product-name a, a.product-item-link, .product-title a, .woocommerce-loop-product__title").first().text().trim()
              || r.find("h2, h3, .product-title").first().text().trim();
    const brand = r.find(".product-brand, .brand-name, .product-brand-name, [itemprop='brand']").first().text().trim() || "Unknown";
    const pt = r.find(".price, .product-price, .woocommerce-Price-amount, [data-price-amount]").first().text().trim()
             || r.find("[data-price-amount]").first().attr("data-price-amount") || "";
    const price = n(pt); const currency = cur(pt);
    const st = r.find(".stock-status, .availability, .stock, .badge-outofstock").first().text().toLowerCase() || "";
    const inStock = st ? !/ausverkauft|nicht.*verfÃ¼gbar|sold\s*out|out\s*of\s*stock/.test(st) : true;
    let packSize: number|undefined; const m = name.match(/(\d+)\s*(seeds?|samen)/i); if (m) packSize = parseInt(m[1],10);
    if (name && url && Number.isFinite(price) && price>0)
      out.push({ name: name.replace(/\s*\(\d+\s*(seeds?|samen)\)\s*$/i,"").trim(), breeder: brand, price, currency, url, inStock, packSize });
  }

  const seen = new Set<string>(); return out.filter(p=>!seen.has(p.url)&&seen.add(p.url));
}
