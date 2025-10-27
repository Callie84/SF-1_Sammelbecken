import * as cheerio from "cheerio";

type Item = { name:string; price:number|null; currency:string|null; url:string|null };

function cleanName(t?: string | null){
  const s = (t||"").replace(/\s+/g," ").trim();
  return s.startsWith("Read More about ") ? s.replace(/^Read More about\s+/,"") : s;
}
function norm(t?:string|null){ return (t||"").replace(/\s+/g," ").trim(); }

function parsePrice(raw:string){
  const cleaned = (raw||"").replace(/\u00A0/g," ").trim();
  // breiter: €/$/£, 1.234,56 oder 1,234.56 oder 1234
  const m = cleaned.match(/([\d]+(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(€|\$|£|usd|eur|gbp|chf)?/i);
  if(!m) return { price:null, currency:null };
  const num = m[1].replace(/\./g,"").replace(/,/g,".");
  const sym = (m[2]||"").toUpperCase();
  let currency: string|null =
    sym === "USD" || sym === "$" ? "USD" :
    sym === "EUR" || sym === "€" ? "EUR" :
    sym === "GBP" || sym === "£" ? "GBP" :
    /€|EUR/i.test(cleaned) ? "EUR" :
    /\$|USD/i.test(cleaned) ? "USD" :
    /£|GBP/i.test(cleaned) ? "GBP" : null;
  const price = Number(num);
  return { price: Number.isFinite(price) ? price : null, currency };
}

function uniq(items:Item[]):Item[]{
  const seen = new Set<string>(), out:Item[]=[];
  for(const it of items){
    const k = `${it.name}|${it.price}|${it.currency}|${it.url||""}`;
    if(it.name && !seen.has(k)){ seen.add(k); out.push(it); }
  }
  return out;
}

// harte Filter gegen Fehl-Treffer
function filterItems(items: Item[]): Item[] {
  const BAD_NAME = /^(home|filter results|filters?|sort(?: by)?|subscribe|contact|read more|add to cart|cart|wishlist|login|logout|account|menu|shop now|view more)$/i;
  return items
    .filter(it => !!it.name && it.name.trim().length > 2)
    .filter(it => !BAD_NAME.test(it.name.trim()))
    // Preis darf null sein -> nicht filtern
    .filter(it => {
      const u = (it.url||"").trim().toLowerCase();
      if(!u) return true;
      if(u.startsWith("javascript:")) return false;
      if(u === "#" || u.startsWith("#")) return false;
      return true;
    })
    .map(it => ({ ...it, name: cleanName(norm(it.name)) }));
}

function fromJsonLd($:cheerio.CheerioAPI):Item[]{
  const pushProduct = (p:any, out:Item[])=>{
    let name = cleanName(norm(p?.name || p?.brand || p?.sku || p?.description));
    // Preisquellen in offers / priceSpecification
    const offers = Array.isArray(p?.offers) ? p.offers[0] : p?.offers;
    const priceRaw = String(
      offers?.price ??
      offers?.priceSpecification?.price ??
      p?.price ?? ""
    );
    const curRaw = String(
      offers?.priceCurrency ?? p?.priceCurrency ?? offers?.priceSpecification?.priceCurrency ?? ""
    );
    const { price, currency } = priceRaw ? parsePrice(`${priceRaw} ${curRaw}`) : { price:null, currency: curRaw || null };
    const url = p?.url || offers?.url || null;
    if(name) out.push({ name, price, currency, url });
  };

  const out:Item[]=[];
  $('script[type="application/ld+json"]').each((_,el)=>{
    const txt = $(el).text();
    try{
      const data:any = JSON.parse(txt);

      // @graph unterstützen
      const roots:any[] = [];
      if (Array.isArray(data)) roots.push(...data);
      else if (Array.isArray(data?.["@graph"])) roots.push(...data["@graph"]);
      else roots.push(data);

      for(const d of roots){
        const t = String(d?.["@type"]||d?.type||"").toLowerCase();

        if(t.includes("product")){
          pushProduct(d,out);
          continue;
        }

        if(t.includes("itemlist") && Array.isArray(d.itemListElement)){
          for(const it of d.itemListElement){
            const v = it?.item ?? it;
            if(v && String(v?.["@type"]||"").toLowerCase().includes("product")){
              pushProduct(v,out);
            }
          }
        }
      }
    }catch{/* ignore */}
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
      $el.find('a[title], h1, h2, h3, .title').first().text()
    );
    let priceRaw = $el.find('[itemprop="price"]').first().attr('content')
                 || $el.find('[itemprop="price"]').first().text()
                 || $el.find('[data-price],[data-product-price]').first().attr('data-price')
                 || "";
    priceRaw = norm(priceRaw||"");
    const cur = $el.find('[itemprop="priceCurrency"]').first().attr('content') || null;
    const { price, currency } = parsePrice(`${priceRaw} ${cur||""}`);
    let url = $el.find('[itemprop="url"]').attr('content')
             || $el.find('a[href]').first().attr('href') || null;
    if(url && url.startsWith("//")) url = "https:" + url;
    if(name) out.push({ name: cleanName(name), price, currency, url });
  });
  return out;
}

export default function extract(html:string): Item[] {
  const $ = cheerio.load(html);

  let items = fromJsonLd($);
  if(items.length===0) items = fromMicrodata($);

  if(items.length===0){
    const out: Item[] = [];

    const priceSel = [
      '.woocommerce-Price-amount',
      '.amount',
      '.money',
      '.price',
      '[class*="price"]',
      '.price-item',
      '.price-item--regular',
      '.price__regular',
      '.price__current',
      '.price--large',
      '.product-price',
      '.grid-product__price',
      '.card__price',
      '.product-card__price',
      '[data-price]',
      '[data-product-price]',
      'meta[itemprop="price"]'
    ].join(',');

    const nodes = $([
      ".product",".product-item",".product-card",".product-tile",
      "li.product","article.product",
      ".product-grid-item",".grid-product",".grid__item",".grid-product__content",
      ".product-list-item",".collection-product",
      ".productItem",".product__item",".prod__item",
      ".productgrid--item",".productitem",
      ".card",".card-wrapper",".card-information",
      ".woocommerce ul.products li.product",".products .product",
      ".product-card__info",".product-card__content",".product-card__title",
      "[data-product]","[data-sku]"
    ].join(","));

    nodes.each((_, el) => {
      const el$ = $(el);
      let name =
        el$.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a[title]').first().attr('title')
        || el$.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a').first().text()
        || "";
      name = cleanName(norm(name));

      let priceTxt =
        norm(el$.find(priceSel).first().text()) ||
        norm(el$.find('meta[itemprop="price"]').attr('content')||"") ||
        norm(el$.attr('data-price')||el$.attr('data-product-price')||"");
      const { price, currency } = parsePrice(priceTxt);

      let url = el$.find('a[href]').first().attr('href') || null;
      if(url && url.startsWith("//")) url = "https:" + url;

      // Junk raus
      const badName = /^(home|filter results|filters?|sort(?: by)?|subscribe|contact|read more|add to cart|cart|wishlist|login|logout|account|menu|shop now|view more)$/i;
      if(!name || badName.test(name)) return;
      if(url && url.startsWith("javascript")) return;

      out.push({ name, price, currency, url });
    });

    if(out.length===0){
      // Heuristik: Preistext finden, dann umgebende Box als Produkt lesen
      const PRICE = /\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\b/;
      $('*').each((_, el) => {
        const t = norm($(el).text());
        if(!PRICE.test(t)) return;
        const box = $(el).closest('li,article,div,section,.card,.product,.product-item,.product-card,.productgrid--item,.grid__item');
        if(!box.length) return;

        const name = cleanName(norm(
          box.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a[title]').first().attr('title')
          || box.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a').first().text()
        ));
        const priceTxt = norm(box.find(priceSel).first().text() || t);
        const { price, currency } = parsePrice(priceTxt);
        const href = box.find('a[href]').first().attr('href') || null;

        const badName = /^(home|filter results|filters?|sort(?: by)?|subscribe|contact|read more|add to cart|cart|wishlist|login|logout|account|menu|shop now|view more)$/i;
        if(!name || badName.test(name)) return;
        if(href && href.startsWith("javascript")) return;

        out.push({ name, price, currency, url: href });
      });
    }

    // Letzter Fallback: Link-Kacheln auch ohne Preis
    if(out.length===0){
      const tileSel = [
        'li','article','div','section','.card','.grid__item',
        '.product','.product-item','.product-card','.product-tile',
        '.collection-product','.productgrid--item','.product__item','.productItem'
      ].join(',');
      $(tileSel).each((_, boxEl) => {
        const box = $(boxEl);
        let name =
          box.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a[title]').first().attr('title')
          || box.find('h1,h2,h3,.product-title,.card-title,.title,.product-name,.product-item__title,.grid-product__title,.card-information__text,.product-card__title,a.full-unstyled-link,a').first().text()
          || '';
        name = cleanName(norm(name));
        if(!name) return;

        let href = box.find('a[href]').first().attr('href') || null;
        if(href && href.startsWith('//')) href = 'https:' + href;
        if(href && (href.startsWith('javascript') || href === '#' || href.startsWith('#'))) href = null;

        const priceTxt = norm(box.find(priceSel).first().text());
        const { price, currency } = parsePrice(priceTxt);

        const BAD_NAME = /^(home|filter results|filters?|sort(?: by)?|subscribe|contact|read more|add to cart|cart|wishlist|login|logout|account|menu|shop now|view more)$/i;
        if(BAD_NAME.test(name)) return;

        out.push({ name, price, currency, url: href });
      });
    }

    items = out;
  }

  // finale Bereinigung
  items = filterItems(items);
  return uniq(items);
}
