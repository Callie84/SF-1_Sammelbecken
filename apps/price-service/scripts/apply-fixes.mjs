import { readFileSync, writeFileSync } from "node:fs";

const file = ".\\src\\scrapers\\extract.ts";
let s = readFileSync(file,"utf8");

// 1) Funktionen einfügen, wenn sie fehlen
if (!/function\s+fromAppState\(/.test(s)) {
  const inject = `
function pickPrice(v:any): {price:number|null,currency:string|null}{
  if(!v) return {price:null,currency:null};
  const c:any[]=[
    v.price, v.price_min, v.priceMin, v.priceValue, v.priceV2?.amount,
    v.compare_at_price, v.compareAtPrice, v?.variants?.[0]?.price,
    v?.offers?.price, v?.prices?.price
  ].filter(x=>x!=null);
  return parsePrice(String(c[0] ?? ""));
}

function fromAppState($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  const scripts = $('script').map((_,el)=>$(el).text()).get();
  for(const txt of scripts){
    const mNext = txt.match(/__NEXT_DATA__\\s*=\\s*(\\{[\\s\\S]*?\\})/);
    if(mNext){ try{
      const data = JSON.parse(mNext[1]); const stack:any[]=[data];
      while(stack.length){
        const cur=stack.pop();
        if(Array.isArray(cur)){
          for(const p of cur){
            if(p && (p.title||p.name) && (p.price||p.priceMin||p?.variants?.[0]?.price)){
              const name = cleanName(norm(String(p.title||p.name)));
              const {price,currency}=pickPrice(p);
              const url = p.url || (p.handle?\\`/\\${p.handle}\\`: null);
              if(name) out.push({name,price,currency,url});
            }
            if(p && typeof p==='object') stack.push(p);
          }
        }else if(cur && typeof cur==='object'){
          for(const k of Object.keys(cur)) stack.push((cur as any)[k]);
        }
      }
    }catch{} }

    const mNuxt = txt.match(/__NUXT__\\s*=\\s*(\\{[\\s\\S]*?\\})/);
    if(mNuxt){ try{
      const data = JSON.parse(mNuxt[1]); const stack:any[]=[data];
      while(stack.length){
        const cur=stack.pop();
        if(Array.isArray(cur)){
          for(const p of cur){
            if(p && (p.title||p.name) && (p.price||p.priceMin||p?.variants?.[0]?.price)){
              const name = cleanName(norm(String(p.title||p.name)));
              const {price,currency}=pickPrice(p);
              const url = p.url || (p.slug?\\`/\\${p.slug}\\`: null);
              if(name) out.push({name,price,currency,url});
            }
            if(p && typeof p==='object') stack.push(p);
          }
        }else if(cur && typeof cur==='object'){
          for(const k of Object.keys(cur)) stack.push((cur as any)[k]);
        }
      }
    }catch{} }

    if(/Shopify/i.test(txt)){
      const jsons = txt.match(/\\{[\\s\\S]*?\\}/g) || [];
      for(const j of jsons){ try{
        const o = JSON.parse(j); const stack:any[]=[o];
        while(stack.length){
          const cur=stack.pop();
          if(Array.isArray(cur)){
            for(const p of cur){
              if(p && (p.title||p.name) && (p.price||p.price_min||p?.variants?.[0]?.price)){
                const name = cleanName(norm(String(p.title||p.name)));
                const {price,currency}=pickPrice(p);
                const url = p.url || (p.handle?\\`/\\${p.handle}\\`: null);
                if(name) out.push({name,price,currency,url});
              }
              if(p && typeof p==='object') stack.push(p);
            }
          }else if(cur && typeof cur==='object'){
            for(const k of Object.keys(cur)) stack.push((cur as any)[k]);
          }
        }
      }catch{} }
    }
  }
  return uniq(out);
}

function fromHeuristic($:cheerio.CheerioAPI):Item[]{
  const out:Item[]=[];
  const PRICE=/(\\d{1,3}([.,]\\d{3})*[.,]\\d{2})/;
  const CUR=/(|\\$|eur|usd)/i;
  $('*').each((_,el)=>{
    const t = ($(el).text()||'').replace(/\\s+/g,' ').trim();
    if(!PRICE.test(t)) return;
    if(!CUR.test(t)) return;
    const box = $(el).closest('li,article,div,section');
    const a = box.find('a[href]').first();
    const name = cleanName(norm(a.attr('title') || a.text() || box.find('h2,h3,.title').first().text()));
    const {price,currency}=parsePrice(t);
    const url = a.attr('href') || null;
    if(name) out.push({name,price,currency,url});
  });
  return uniq(out);
}
`;
  // vor export default einfügen, sonst ans Ende anhängen
  const hook = s.indexOf("export default function extract");
  s = hook > -1 ? s.slice(0,hook) + inject + s.slice(hook) : s + "\n" + inject;
}

// 2) Aufrufkette vereinheitlichen
s = s.replace(
/let items = fromJsonLd\\(\\$\\)[\\s\\S]*?return uniq\\(items\\);/,
`let items = fromJsonLd($);
if(items.length===0) items = fromMicrodata($);
if(items.length===0) items = fromAppState($);
if(items.length===0) items = fromGenericCss($);
if(items.length===0) items = fromHeuristic($);
return uniq(items);`
);

// 3) Heuristik-Währungsregex korrigieren, falls noch die defekte Variante existiert
s = s.replace(/const\\s+CUR\\s*=\\s*[^;]+;/, 'const CUR=/(|\\\\$|eur|usd)/i;');

// 4) Selektoren-Array robust halten
s = s.replace(/const\\s+selectors\\s*=\\s*\\[[\\s\\S]*?\\];/, `const selectors = [
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

writeFileSync(file, s, "utf8");
console.log("patched extract.ts");
