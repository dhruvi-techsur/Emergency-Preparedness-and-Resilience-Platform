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

// FEEDBACK
export { Skeleton } from './feedback/Skeleton';
export type { SkeletonProps } from './feedback/Skeleton';
export { Badge } from './feedback/Badge';
export type { BadgeProps, BadgeTone } from './feedback/Badge';
export { Alert } from './feedback/Alert';
export type { AlertProps, AlertTone } from './feedback/Alert';
export { EmptyState } from './feedback/EmptyState';
export type { EmptyStateProps } from './feedback/EmptyState';
export { Toast } from './feedback/Toast';
export type { ToastProps, ToastTone } from './feedback/Toast';

// LAYOUT
export { Card } from './layout/Card';
export type { CardProps } from './layout/Card';

// DATA
export { Avatar } from './data/Avatar';
export type { AvatarProps, AvatarSize } from './data/Avatar';
