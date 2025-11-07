import { chromium } from "playwright";
import { log } from "./logger";
import { allowedToCrawl, userAgent } from "./robots";
import { connect, upsertPrices } from "./db";
import { groupBySeed } from "./normalize";
import { ZamnesiaAdapter } from "./adapters/zamnesia";
import { RQSAdapter } from "./adapters/rqs";

const TARGET = process.env.TARGET || "zamnesia";

async function main() {
  const origin = targetToOrigin(TARGET);
  if (!(await allowedToCrawl(origin))) {
    log.warn({ origin }, "robots.txt disallows crawling");
    process.exit(0);
  }

  await connect();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: userAgent() });
  const page = await context.newPage();

  const adapter = pickAdapter(TARGET);
  log.info({ target: TARGET }, "scraper start");
  const { items, errors } = await adapter.run(page);
  log.info({ count: items.length, errors: errors.length }, "scraper finished");

  if (errors.length) log.warn({ errors });

  const grouped = groupBySeed(items);
  await upsertPrices(grouped);

  await browser.close();
}

function pickAdapter(name: string) {
  switch (name.toLowerCase()) {
    case "zamnesia": return ZamnesiaAdapter;
    case "rqs":
    case "royalqueen": return RQSAdapter;
    default: throw new Error(`unknown TARGET ${name}`);
  }
}

function targetToOrigin(name: string): string {
  switch (name.toLowerCase()) {
    case "zamnesia": return "https://www.zamnesia.com";
    case "rqs":
    case "royalqueen": return "https://www.royalqueenseeds.de";
    default: return "https://example.com";
  }
}

main().catch((e) => {
  log.error(e, "scraper error");
  process.exit(1);
});