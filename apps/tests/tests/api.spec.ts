import { test, expect } from '@playwright/test';

const HEALTH_URL = process.env.HEALTH_URL || 'https://seedfinderpro.de/api/health';

test('API Health liefert status=ok', async ({ request }) => {
  const res = await request.get(HEALTH_URL);
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.status).toBe('ok');
});