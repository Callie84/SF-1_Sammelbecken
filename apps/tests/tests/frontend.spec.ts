import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://seedfinderpro.de';

test('Startseite lÃƒÆ’Ã‚Â¤dt und Titel enthÃƒÆ’Ã‚Â¤lt SeedFinder', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  expect(title.toLowerCase()).toContain('seedfinder');
});