it("parst eine reale Kategorieseite und extrahiert Produkte", () => {
  const html = loadFixture("zamnesia.list.html");
  const items = parseZamnesiaList(html);

  if (items.length === 0) {
    // Debug-Hilfe
    const $ = (await import("cheerio")).load(html);
    const sel = [
      ".product-item",".product","li.product",".product-card",
      ".grid-item",".catalog-grid-item","[data-product-id]"
    ];
    const counts = sel.map(s => [s, $(s).length]);
    console.log("Selector-Counts:", counts);
  }

  expect(items.length).toBeGreaterThan(0);
});
