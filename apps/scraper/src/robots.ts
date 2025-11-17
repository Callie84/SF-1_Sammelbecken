// Minimaler robots.txt Check: blockiert komplett, wenn Disallow: /
export async function allowedToCrawl(origin: string): Promise<boolean> {
  try {
    const url = new URL("/robots.txt", origin).toString();
    const res = await fetch(url, { headers: { "User-Agent": userAgent() } });
    if (!res.ok) return true; // kein robots ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ ok
    const txt = await res.text();
    // sehr einfache PrÃƒÆ’Ã‚Â¼fung
    if (/Disallow:\s*\/$/im.test(txt)) return false;
    return true;
  } catch {
    return true; // bei Fehler nicht blockieren
  }
}

export function userAgent(): string {
  return `SF1Scraper/1.0 (+https://seedfinderpro.de)`;
}