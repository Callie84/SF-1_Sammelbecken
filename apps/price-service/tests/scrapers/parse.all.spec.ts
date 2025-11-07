import { readdirSync, readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { load } from "cheerio";

function extract(html:string){
  const $ = load(html);
  let cards = $([
    '[itemtype*="Product"]','article[class*="product"]','li[class*="product"]','.product-list .product-card'
  ].join(","));
  if (!cards.length) {
    const links = new Set<string>();
    $("a[href$='.html']").each((_,a)=>{ const h=String($(a).attr("href")||""); if (h.endsWith(".html")) links.add(h); });
    if (links.size) cards = $(Array.from(links).map(h=>`a[href="${h}"]`).join(","));
  }
  const items:any[] = [];
  cards.each((_,el)=>{
    const root = $(el).closest("article,li,div").length?$(el).closest("article,li,div"):$(el);
    const name = root.find("h3, .product-title, a[title]").first().text().trim() || root.text().trim();
    const href = root.find('a[href$=".html"]').attr("href") || root.attr("href") || "";
    if (name && href) items.push({ name, url: href });
  });
  return items;
}

describe("Alle Seedbank-Fixtures", () => {
  const files = readdirSync("tests/fixtures").filter(f => f.endsWith(".list.html"));
  for (const f of files) {
    it(`${f} enthält Produkte`, () => {
      const html = readFileSync(`tests/fixtures/${f}`,"utf8");
      const items = extract(html);
      expect(items.length).toBeGreaterThan(0);
    });
  }
});
