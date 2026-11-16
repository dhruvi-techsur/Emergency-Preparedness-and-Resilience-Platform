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

// FORMS
export { TextField } from './forms/TextField';
export type { TextFieldProps, TextFieldSize } from './forms/TextField';
export { Select } from './forms/Select';
export type { SelectProps, SelectOption, SelectSize } from './forms/Select';
export { Checkbox } from './forms/Checkbox';
export type { CheckboxProps, CheckboxSize } from './forms/Checkbox';
export { Switch } from './forms/Switch';
export type { SwitchProps } from './forms/Switch';
export { Combobox } from './forms/Combobox';
export type { ComboboxProps, ComboboxOption, ComboboxSize } from './forms/Combobox';
export { DatePicker } from './forms/DatePicker';
export type { DatePickerProps, DatePickerSize } from './forms/DatePicker';

// DATA
export { Table } from './data/Table';
export type { TableProps, TableColumn, TableErrorState, StatusCellProps } from './data/Table';
export { Timeline } from './data/Timeline';
export type { TimelineProps, TimelineItem, TimelineTone } from './data/Timeline';
export { Stat } from './data/Stat';
export type { StatProps, StatTrend } from './data/Stat';

// NAVIGATION
export { Tabs } from './navigation/Tabs';
export type { TabsProps, TabItem } from './navigation/Tabs';

// OVERLAYS
export { Modal } from './overlays/Modal';
export type { ModalProps } from './overlays/Modal';

// LAYOUT
export { Card } from './layout/Card';
export type { CardProps } from './layout/Card';

// DATA
export { Avatar } from './data/Avatar';
export type { AvatarProps, AvatarSize } from './data/Avatar';

// NAVIGATION
export { Breadcrumbs } from './navigation/Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './navigation/Breadcrumbs';
export { PageHeader } from './navigation/PageHeader';
export type { PageHeaderProps } from './navigation/PageHeader';
export { SideNav } from './navigation/SideNav';
export type { SideNavProps, SideNavGroup, SideNavItem } from './navigation/SideNav';
