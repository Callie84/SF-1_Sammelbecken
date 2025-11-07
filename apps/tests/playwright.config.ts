import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://seedfinderpro.de';

export default defineConfig({
  testDir: './tests',
  retries: 1,
  use: {
    baseURL: BASE_URL,
    trace: 'off'
  },
  reporter: [['list']]
});