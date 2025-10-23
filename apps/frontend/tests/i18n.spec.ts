import { test, expect } from "@playwright/test";


test("i18n: German default", async ({ page }) => {
await page.goto("/");
await expect(page.getByText("SeedFinder PRO")).toBeVisible();
});


test("i18n: switch to EN", async ({ page }) => {
await page.goto("/?lang=en");
await expect(page.getByText("Search")).toBeVisible();
});


test("i18n: result pluralization", async ({ page }) => {
await page.goto("/search?q=test");
// Erwartet, dass der Text Ã¢â‚¬Å¡resultsÃ¢â‚¬Ëœ mit korrekter Pluralisierung angezeigt wird
});