import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const html = readFileSync(process.argv[2],"utf8");
const $ = cheerio.load(html);

const containers = [
  "ul.products li.product",".woocommerce ul.products li.product",
  ".woocommerce-LoopProduct-link",".products .product",
  ".product",".product-item",".product-card",".grid-item",
  ".catalog-item",".collection-product","[data-product-id]",
  "article.product","li.product","div[class*='product']"
];
const priceSels = [".woocommerce-Price-amount",".price",".amount",".money","[class*='price']"];

console.log("=== Container counts ===");
for(const s of containers){ const n = $(s).length; if(n) console.log(n.toString().padStart(4), s); }

console.log("=== Price counts ===");
for(const s of priceSels){ const n = $(s).length; if(n) console.log(n.toString().padStart(4), s); }

// Beispielprobe: erster Container, der einen Preis enthält
for(const s of containers){
  const node = $(s).filter((_,el)=>$(el).find(priceSels.join(",")).length>0).first();
  if(node.length){
    const name = node.find("h2, h3, .title, a[title], a").first().text().trim();
    const price = node.find(priceSels.join(",")).first().text().trim();
    const href = node.find("a[href]").first().attr("href")||"";
    console.log("Sample:", s, "=>", {name, price, href});
    break;
  }
}
