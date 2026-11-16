import { SignJWT, jwtVerify } from 'jose';

export interface SessionClaims {
  sub: string;
  role_id: string;
  jurisdiction_scope: string[];
  jti: string;
}

export interface SessionUser {
  id: string;
  role_id: string;
  jurisdiction_scope: string[];
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_JWT_SECRET;
  if (!secret) {
    throw new Error('SESSION_JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Mints a short-lived (15 min) EPMP session JWT carrying the resolved role
 * and jurisdiction scope, per TechArch 04-security.md §5.1 ("short-lived
 * access tokens (15 min)").
 */
export async function mintSessionToken(user: SessionUser): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({ role_id: user.role_id, jurisdiction_scope: user.jurisdiction_scope, jti })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecretKey());
}

/**
 * Verifies a session JWT's signature and expiry, returning its claims.
 * Throws if the token is invalid, expired, or tampered with.
 */
export async function verifySessionToken(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return {
    sub: payload.sub as string,
    role_id: payload.role_id as string,
    jurisdiction_scope: (payload.jurisdiction_scope as string[]) ?? [],
    jti: payload.jti as string,
  };
}
