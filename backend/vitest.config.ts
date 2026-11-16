import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.ts'],
    // Test-only env defaults (DATABASE_URL/NATS_URL/OPA_URL/KEYCLOAK_ISSUER/
    // SESSION_JWT_SECRET) matching docker-compose.yml's dev stack — see
    // src/test-setup.ts for why these are NOT production-source fallbacks.
    setupFiles: ['./src/test-setup.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
