import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";


const routes = ["/", "/search?q=haze", "/seed/123", "/journal"];


test.describe("WCAG 2.2 AA Ã¢â‚¬â€œ axe", () => {
for (const path of routes) {
test(`a11y: ${path}`, async ({ page }) => {
await page.goto(path);
const accessibilityScanResults = await new AxeBuilder({ page })
.withTags(["wcag2a", "wcag2aa"])
.analyze();
expect(accessibilityScanResults.violations).toEqual([]);
});
}
});