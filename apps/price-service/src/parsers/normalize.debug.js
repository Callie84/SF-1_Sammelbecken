export function normalizePrice(text) {
  if (!text) return {};
  const cur = //.test(text) ? "EUR" : /\$/.test(text) ? "USD" : /£/.test(text) ? "GBP" :
              /\bEUR\b/i.test(text) ? "EUR" : /\bUSD\b/i.test(text) ? "USD" :
              /\bGBP\b/i.test(text) ? "GBP" : undefined;
  const cleaned = text.replace(/[^0-9,.\s]/g, "").trim();
  const m = cleaned.match(/([0-9]{1,3}([.\s][0-9]{3})*|[0-9]+)([,.][0-9]{1,2})?/);
  if (!m) return { currency: cur };
  const n = m[0].replace(/\s/g,"").replace(/\.(?=[0-9]{3}\b)/g,"").replace(",",".");
  const val = Number(n);
  if (!isFinite(val)) return { currency: cur };
  return { value: val, currency: cur };
}
export function absolutizeUrl(href, base) {
  if (!href) return;
  try { return base ? new URL(href, base).toString() : new URL(href).toString(); }
  catch { return href; }
}
export function normalizeItem(raw, baseUrl) {
  const name = (raw.name || "").trim();
  const url = absolutizeUrl(raw.url, baseUrl) || "";
  const p = normalizePrice(raw.priceText);
  const currency = raw.currency || p.currency;
  const out = { name, url, inStock: raw.inStock };
  if (p.value !== undefined) out.price = p.value;
  if (currency) out.currency = currency;
  return out;
}
