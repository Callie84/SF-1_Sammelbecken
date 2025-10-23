import { Adapter } from "./adapter";
import { AdapterResult, NormalizedPrice } from "../types";
import { sleep } from "../util";

// Beispiel-Selektoren (mÃƒÆ’Ã‚Â¼ssen ggf. angepasst werden, DOM kann sich ÃƒÆ’Ã‚Â¤ndern)
const SELECTORS = {
  item: ".product-list .product",
  name: ".product-title",
  price: ".price .amount"
};

function parsePrice(txt: string): number {
  // "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬29,95" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ 29.95
  const n = txt.replace(/[^0-9,\.]/g, "").replace(/\./g, "").replace(",", ".");
  return Number.parseFloat(n);
}

export const ZamnesiaAdapter: Adapter = {
  seedbank: "Zamnesia",
  startUrl: "https://www.zamnesia.com/" /* ggf. Kategorie-URL */,
  async run(page): Promise<AdapterResult> {
    const items: NormalizedPrice[] = [];
    const errors: { message: string; context?: any }[] = [];

    // Beispiel: nur eine Seite
    await page.goto(this.startUrl, { waitUntil: "domcontentloaded" });
    await sleep(1500);

    const cards = await page.$$(SELECTORS.item);
    for (const card of cards) {
      try {
        const name = (await card.$eval(SELECTORS.name, el => (el as HTMLElement).innerText)).trim();
        const priceTxt = (await card.$eval(SELECTORS.price, el => (el as HTMLElement).textContent || "")).trim();
        const price = parsePrice(priceTxt);
        if (!name || !Number.isFinite(price)) continue;
        items.push({ name, seedbank: "Zamnesia", price, currency: "EUR" });
      } catch (e: any) {
        errors.push({ message: e.message });
      }
    }

    return { items, errors };
  }
};