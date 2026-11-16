import * as React from 'react';

/** Matches backend's GET /api/v1/me response shape (auth-org/routes.ts). */
export interface EpmpUser {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; persona_id: string } | null;
  jurisdiction_scope: string[];
  theme_preference: 'light' | 'dark' | 'contrast';
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

export interface AuthContextValue {
  user: EpmpUser;
  /** Lets ThemeSwitcher update the in-memory user after a successful PATCH, without a full re-fetch. */
  setThemePreference: (theme: EpmpUser['theme_preference']) => void;
}

/**
 * Provided by RouteGuard once GET /api/v1/me resolves successfully — never
 * `null` for any component that reads it, since RouteGuard only renders its
 * children (AppShell and everything inside it) after a successful
 * resolution. Consumers that might render before/outside RouteGuard should
 * not use this hook.
 */
export const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() called outside of RouteGuard — no resolved user in context');
  }
  return ctx;
}
