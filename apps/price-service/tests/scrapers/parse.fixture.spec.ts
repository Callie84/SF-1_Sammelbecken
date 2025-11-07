import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { load } from "cheerio";

describe("Zamnesia List Parser (Fixture)", () => {
  it("parst eine reale Kategorieseite und extrahiert Produkte", () => {
    const html = readFileSync("tests/fixtures/zamnesia.list.html", "utf8");
    const $ = load(html);

    const selList = [
      '[itemtype*="Product"]',
      'article[class*="product"]',
      'li[class*="product"]',
      '.product-list .product-card'
    ];
    let cards = $(selList.join(","));

    if (cards.length === 0) {
      const productLinks = new Set<string>();
      $('a[href$=".html"]').each((_, a) => {
        const href = String($(a).attr("href") || "");
        if (/^https?:\/\/(www\.)?zamnesia\.com\/(us|de)\/\d+-.+\.html$/.test(href)) {
          productLinks.add(href);
        }
      });
      if (productLinks.size > 0) {
        cards = $(Array.from(productLinks).map(h => `a[href="${h}"]`).join(","));
      }
    }

    const items: Array<{ name: string; price?: string; url: string }> = [];
    cards.each((_, el) => {
      const root = $(el).closest("article,li,div").length ? $(el).closest("article,li,div") : $(el);
      const name =
        root.find("h3, .product-title, a[title]").first().text().trim() ||
        root.text().trim();
      const price = root.find('[class*="price"], .price').first().text().trim();
      const href =
        root.find('a[href$=".html"]').attr("href") ||
        root.attr("href") || "";

      if (name && href) items.push({ name, price, url: href });
    });

    expect(items.length).toBeGreaterThan(0);
    for (const it of items) expect(it.url).toMatch(/\.html$/);
  });
});
