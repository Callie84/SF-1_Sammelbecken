import { Adapter } from "./adapter";
import { AdapterResult, NormalizedPrice } from "../types";
import { sleep } from "../util";

const SELECTORS = {
  item: "[data-product]",
  name: ".product-title, [itemprop=name]",
  price: ".price, [data-price]"
};

function parsePrice(txt: string): number {
  const n = txt.replace(/[^0-9,\.]/g, "").replace(/\./g, "").replace(",", ".");
  return Number.parseFloat(n);
}

export const RQSAdapter: Adapter = {
  seedbank: "Royal Queen Seeds",
  startUrl: "https://www.royalqueenseeds.de/" /* ggf. Kategorie-URL */,
  async run(page): Promise<AdapterResult> {
    const items: NormalizedPrice[] = [];
    const errors: { message: string; context?: any }[] = [];

    await page.goto(this.startUrl, { waitUntil: "domcontentloaded" });
    await sleep(1500);

    const cards = await page.$$(SELECTORS.item);
    for (const card of cards) {
      try {
        const name = (await card.$eval(SELECTORS.name, el => (el as HTMLElement).innerText)).trim();
        const priceTxt = (await card.$eval(SELECTORS.price, el => (el as HTMLElement).textContent || "")).trim();
        const price = parsePrice(priceTxt);
        if (!name || !Number.isFinite(price)) continue;
        items.push({ name, seedbank: "Royal Queen Seeds", price, currency: "EUR" });
      } catch (e: any) {
        errors.push({ message: e.message });
      }
    }

    return { items, errors };
  }
};