// EPMP Design System — public entry point.
//
// Every named export here is re-exported as `window.EPMP` by the Vite IIFE
// build (vite.config.ts `lib.name: 'EPMP'`), per the "Loading the system in a
// page" contract in EPMP-llm-build-guide.md.
import './base.css';

export const EPMP_DESIGN_SYSTEM_VERSION = '0.1.0';

// FOUNDATIONS
export { Icon, ICON_NAMES } from './foundations/Icon';
export type { IconProps, IconName, IconSize } from './foundations/Icon';

// ACTIONS
export { Button } from './actions/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './actions/Button';
export { IconButton } from './actions/IconButton';
export type { IconButtonProps } from './actions/IconButton';
