import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";
const html = readFileSync(process.argv[2],"utf8");
const $ = cheerio.load(html);
const sels = [
  // generisch
  ".product",".product-item",".product-card",".productGrid .product",
  "li.product","article.product","div[class*='product']",
  ".grid-item",".card:has([class*='price'])",
  // WooCommerce
  "ul.products li.product",".woocommerce ul.products li.product",
  ".woocommerce-loop-product__link",".woocommerce-LoopProduct-link",
  ".price",".amount",".price .amount",".woocommerce-Price-amount",
  // Shopify
  ".grid-product",".grid-product__content",".price__regular",".price-item",
  ".card-information",".card-wrapper","a.full-unstyled-link",
  // weitere Kandidaten
  ".item",".item-product",".productbox",".product_tile",".catalog-item",
  "[data-product-id]","[data-product]","[data-item]"
];
for(const s of sels){ const n = $(s).length; if(n) console.log(n.toString().padStart(4), s); }
