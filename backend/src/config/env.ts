export interface EnvConfig {
  DATABASE_URL?: string;
  NATS_URL?: string;
  OPA_URL?: string;
  KEYCLOAK_ISSUER?: string;
  KEYCLOAK_CLIENT_ID?: string;
  SESSION_JWT_SECRET?: string;
  PORT: string;
}

/**
 * Loads typed environment configuration. Every value is optional at the
 * type level except PORT (which has a default) — nothing throws at import
 * time, so the app can start with nothing but PORT set (per DEPLOY-01).
 */
export function loadEnv(): EnvConfig {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    NATS_URL: process.env.NATS_URL,
    OPA_URL: process.env.OPA_URL,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    SESSION_JWT_SECRET: process.env.SESSION_JWT_SECRET,
    PORT: process.env.PORT ?? "8080",
  };
}
