// Vitest `setupFiles` entry — test-only environment defaults.
//
// The platform's pre-push gate (and any fresh shell) runs `npm test` without
// manually exporting DATABASE_URL/NATS_URL/OPA_URL/KEYCLOAK_ISSUER/
// SESSION_JWT_SECRET first. Production code (db/client.ts, nats-client.ts,
// opa-client.ts, session.ts, migrate-runner.ts) deliberately treats an unset
// var as "no backing service configured" per DEPLOY-01's graceful-degradation
// contract (the app must boot with only PORT set) — so these defaults belong
// here, in a test-only setup file, NOT as fallbacks in the source files
// themselves, which would silently defeat that contract in production.
//
// Values match docker-compose.yml's committed dev-stack credentials exactly
// (postgres/devpass@localhost:5432/epmp, nats://localhost:4222,
// http://localhost:8181, http://localhost:8081/realms/epmp) — the same
// stack every *.test.ts file's own doc-comment already requires to be
// running via `docker compose up -d db nats opa keycloak`.
//
// `??=` only fills a var that is genuinely unset, so a CI/gate environment
// that DOES export its own values (e.g. a different Postgres host) is never
// overridden.
process.env.DATABASE_URL ??= 'postgres://postgres:devpass@localhost:5432/epmp';
process.env.NATS_URL ??= 'nats://localhost:4222';
process.env.OPA_URL ??= 'http://localhost:8181';
process.env.KEYCLOAK_ISSUER ??= 'http://localhost:8081/realms/epmp';
process.env.KEYCLOAK_CLIENT_ID ??= 'epmp-app';
process.env.SESSION_JWT_SECRET ??= 'test-only-session-jwt-secret-not-for-prod-0123456789';
