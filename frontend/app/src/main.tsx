// Flash-of-wrong-theme guard (F00-application-shell.md §Process 2): set
// data-theme synchronously, before any React render, so the document root
// never paints with the wrong theme even for a single frame. index.html's
// <body data-theme="light"> is the pre-JS default; this line is the
// earliest point at which JS runs, so it's a no-op confirming 'light'
// until RouteGuard resolves the user's real persisted preference and
// AppShell/ThemeSwitcher update the attribute again post-resolution.
document.documentElement.dataset.theme = document.body.dataset.theme ?? 'light';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Monorepo-bundled loading (not the standalone <script>-tag pattern in
// EPMP-llm-build-guide.md, which targets a plain HTML page loading
// window.EPMP directly) — see index.html's comment for why these are
// ordinary ES module imports instead of raw <link> tags.
import '@epmp/design-system/tokens/tokens.css';
import '@epmp/design-system/dist/bundle.css';

import { RouteGuard } from './auth/RouteGuard';
import { SignInCallback } from './pages/SignInCallback';
import { AppShell } from './app-shell/AppShell';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteGuard>
          <Routes>
            <Route path="/auth/callback" element={<SignInCallback />} />
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </RouteGuard>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
