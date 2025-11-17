import { describe, it, expect } from "vitest";
import { parsePrice } from "../../src/lib/price";

const cases: Array<[string, number, string]> = [
  [" 1.234,56", 1234.56, "EUR"],
  ["1,234.56 $", 1234.56, "USD"],
  ["GBP 1 234,56", 1234.56, "GBP"],
  ["CHF 99", 99, "CHF"],
  ["1.999 ", 1999, "EUR"],
  ["Read More about 12,50 ", 12.5, "EUR"],
];

describe("parsePrice", ()=>{
  it.each(cases)("%s", (raw, p, c)=>{
    const r = parsePrice(String(raw));
    expect(r.price).toBeCloseTo(p, 2);
    expect(r.currency).toBe(c);
  });
});
