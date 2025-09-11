const { Cluster } = require('puppeteer-cluster');
const PriceEntry = require('../models/PriceEntry');
const Seed = require('../models/Seed');

// Scrape prices from configured seedbanks
async function scrapePrices() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 5,
    puppeteerOptions: { headless: true }
  });

  const seeds = await Seed.find().lean();
  await cluster.task(async ({ page, data: seed }) => {
    const url = seed.url; // e.g. seed.url stores shop product page
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
    // Example selector, needs customization per shop
    const priceText = await page.$eval('.price', el => el.textContent);
    const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
    // Upsert price entry
    await PriceEntry.updateOne(
      { strain: seed.strain, seedbank: seed.seedbank },
      { price, currency: 'EUR', timestamp: new Date(), url },
      { upsert: true }
    );
  });

  for (const seed of seeds) {
    cluster.queue(seed);
  }

  await cluster.idle();
  await cluster.close();
}

module.exports = { scrapePrices };