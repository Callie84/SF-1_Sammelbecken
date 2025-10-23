import { NormalizedPrice } from "./types";

export function groupBySeed(items: NormalizedPrice[]): { name: string; prices: { seedbank: string; price: number; currency: string }[] }[] {
  const map = new Map<string, { seedbank: string; price: number; currency: string }[]>();
  for (const it of items) {
    if (!map.has(it.name)) map.set(it.name, []);
    map.get(it.name)!.push({ seedbank: it.seedbank, price: it.price, currency: it.currency });
  }
  return [...map.entries()].map(([name, prices]) => ({ name, prices }));
}