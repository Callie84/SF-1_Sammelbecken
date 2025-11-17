// apps/price-service/src/scrapers/base/RobotsCache.ts
import fetch from "node-fetch";

const CACHE = new Map<string, string>();

export async function getRobotsTxt(url: string): Promise<string | null> {
  const u = new URL(url);
  const key = `${u.protocol}//${u.host}`;
  if (CACHE.has(key)) return CACHE.get(key)!;

  const robotsUrl = `${key}/robots.txt`;
  const res = await fetch(robotsUrl);
  if (!res.ok) return null;

  const text = await res.text();
  CACHE.set(key, text);
  return text;
}

export function isDisallowed(robotsText: string, path: string): boolean {
  const lines = robotsText.split("\n");
  for (const line of lines) {
    const l = line.trim().toLowerCase();
    if (!l.startsWith("disallow:")) continue;
    const rule = l.replace("disallow:", "").trim();
    if (rule === "") continue;
    if (path.startsWith(rule)) return true;
  }
  return false;
}
