// EPMP Design System — public entry point.
//
// Every named export here is re-exported as `window.EPMP` by the Vite IIFE
// build (vite.config.ts `lib.name: 'EPMP'`), per the "Loading the system in a
// page" contract in EPMP-llm-build-guide.md.
import './base.css';

// This file is intentionally empty of components until Task 2 adds the first
// ones (Icon, Button, IconButton) — it exists in Task 1 only so the library
// build pipeline has a valid entry point to compile, and so dist/bundle.css
// is produced by the very first build (components add their own .css import
// alongside, accumulating into the same bundle.css).
export const EPMP_DESIGN_SYSTEM_VERSION = '0.1.0';
