import { defineConfig } from 'vitest/config';

// Separate from playwright.config.ts/e2e/ — `npm run test` (vitest, unit
// tests under src/**/*.test.ts) and `npm run test:e2e` (Playwright, under
// e2e/) must never collide: different runners, different globs, different
// commands.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
