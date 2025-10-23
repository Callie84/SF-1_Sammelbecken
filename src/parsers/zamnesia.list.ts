import * as cheerio from "cheerio";

export interface ParsedItem {
  name: string;
  breeder: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  packSize?: number;
}

function parsePrice(text: string): number {
  const n = parseFloat(text.replace(/[^\d,\.]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function normCurrency(text: string): string {
  if (/â‚¬|eur/i.test(text)) return "EUR";
  if (/\$|usd/i.test(text)) return "USD";
  if (/Â£|gbp/i.test(text)) return "GBP";
  return "EUR";
}

export function parseZamnesiaList(html: string): ParsedItem[] {
  const $ = cheerio.load(html);
  const out: ParsedItem[] = [];

  // 1) JSON-LD ProductList / Product
  $('script[type="application/ld+json"]').each((_, s) => {
    try {
      const data = JSON.parse($(s).contents().text());
      const list = Array.isArray(data) ? data : [data];
      for (const d of list) {
        const products = [];
        if (d["@type"] === "Product") products.push(d);
        if (Array.isArray(d.itemListElement)) {
          for (const it of d.itemListElement) {
            if (it.item && it.item["@type"] === "Product") products.push(it.item);
          }
        }
        for (const p of products) {
          const name = String(p.name || "").trim();
          const url = String(p.url || p["@id"] || "").trim();
          const brand = p.brand?.name || p.brand || "Unknown";
          const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
          const price = parsePrice(String(offer?.price || offer?.priceSpecification?.price || ""));
          const currency = String(offer?.priceCurrency || "EUR");
          const inStock = String(offer?.availability || "").toLowerCase().includes("instock");
          if (name && url && Number.isFinite(price) && price > 0) {
            out.push({ name, breeder: String(brand), price, currency, url, inStock });
          }
        }
      }
    } catch {}
  });

  // 2) Breite Card-Selektoren (hÃ¤ufige Shop-Themes)
  const cards = $([
    ".product-item",
    ".product",
    "li.product",
    ".product-card",
    ".grid-item",
    ".catalog-grid-item",
    "[data-product-id]"
  ].join(",")).toArray();

  for (const el of cards) {
    const root = $(el);
    const a = root.find("a[href*='http']").first();
    const url = a.attr("href") || "";
    const name =
      root.find(".product-name a, h2.product-name a, a.product-item-link, .product-title a, .woocommerce-loop-product__title")
          .first().text().trim()
      || root.find("h2, h3, .product-title").first().text().trim();

    const brand =
      root.find(".product-brand, .brand-name, .product-brand-name, [itemprop='brand']")
          .first().text().trim() || "Unknown";

    const priceText =
      root.find(".price, .product-price, .woocommerce-Price-amount, [data-price-amount]")
          .first().text().trim()
      || root.find("[data-price-amount]").first().attr("data-price-amount") || "";

    const price = parsePrice(priceText);
    const currency = normCurrency(priceText);

    const stockText =
      root.find(".stock-status, .availability, .stock, .badge-outofstock").first().text().toLowerCase() || "";
    const inStock = stockText ? !/ausverkauft|nicht.*verfÃ¼gbar|sold\s*out|out\s*of\s*stock/.test(stockText) : true;

    let packSize: number | undefined;
    const sizeMatch = name.match(/(\d+)\s*(seeds?|samen)/i);
    if (sizeMatch) packSize = parseInt(sizeMatch[1], 10);

    if (name && url && Number.isFinite(price) && price > 0) {
      out.push({
        name: name.replace(/\s*\(\d+\s*(seeds?|samen)\)\s*$/i, "").trim(),
        breeder: brand,
        price,
        currency,
        url,
        inStock,
        packSize
      });
    }
  }

  // 3) Dedup nach URL
  const seen = new Set<string>();
  return out.filter(p => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });
}
