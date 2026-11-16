import { defineConfig } from '@playwright/test';

// Single-worker per the sandbox CPU-constraint rule — every Playwright
// worker launches its own browser, and this sandbox has as few as 2 CPUs
// available.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
});
