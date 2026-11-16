import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runner } from 'node-pg-migrate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolved relative to this compiled file's own location (dist/db/ or
// src/db/ in dev), NOT process.cwd() — the Dockerfile's CMD invokes this
// from WORKDIR /app as `node backend/dist/db/migrate-runner.js`, where
// cwd is /app but migrations live at /app/backend/migrations. A bare
// 'migrations' relative path (what `cd backend && npm run migrate`'s CLI
// invocation resolves against its own cwd) would miss entirely here.
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

/**
 * Programmatic migration runner for the Dockerfile's runtime CMD:
 * `node backend/dist/db/migrate-runner.js && node backend/dist/server.js`.
 *
 * DEPLOY-01 D4/D5's graceful-degradation contract applies here too: when
 * DATABASE_URL is unset (e.g. the deploy-check's "only PORT set" boot test),
 * this exits 0 WITHOUT attempting to migrate, rather than throwing — so the
 * subsequent `node backend/dist/server.js` in the CMD's `&&` chain always
 * runs regardless of whether a database is configured.
 *
 * When DATABASE_URL IS set, a migration failure DOES exit non-zero (surfaced
 * loudly rather than silently swallowed) — only the "no DATABASE_URL at all"
 * case is treated as an expected no-op.
 */
async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('migrate-runner: DATABASE_URL not set — skipping migration, server will start anyway');
    process.exit(0);
  }

  try {
    await runner({
      databaseUrl,
      dir: MIGRATIONS_DIR,
      direction: 'up',
      migrationsTable: 'pgmigrations',
      count: Infinity,
    });
    console.log('migrate-runner: migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('migrate-runner: migration failed', err);
    process.exit(1);
  }
}

main();
