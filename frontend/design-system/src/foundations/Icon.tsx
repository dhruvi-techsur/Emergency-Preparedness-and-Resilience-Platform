import * as React from 'react';

/**
 * EPMP Design System — Icon (FOUNDATIONS)
 *
 * One stroke set: 24px grid, 1.75px round stroke, currentColor, no fill,
 * rendered at 16/20/24px. Per Chapter 10 of EPMP-Design-System.pdf.md.
 *
 * Icons support a word; they never replace it, except in IconButton (which
 * requires a label). Status meaning always pairs an icon with a word:
 * check=success, alert=warning, danger=critical, info=information.
 */

export type IconSize = 'sm' | 'default' | 'lg';

const SIZE_PX: Record<IconSize, number> = {
  sm: 16,
  default: 20,
  lg: 24,
};

// The exact named set from Chapter 10's icon grid, in the order presented
// there (6 rows of 6/5/5/6/6/5 excluding the trailing wrap).
export const ICON_NAMES = [
  'check',
  'x',
  'alert',
  'info',
  'danger',
  'chevron-down',
  'chevron-right',
  'chevron-left',
  'plus',
  'minus',
  'search',
  'menu',
  'bell',
  'map',
  'users',
  'shield',
  'file',
  'clock',
  'wifi-off',
  'refresh',
  'sparkle',
  'send',
  'sliders',
  'home',
  'layers',
  'flag',
  'broadcast',
  'truck',
  'arrow-up',
  'arrow-down',
  'external',
  'eye',
  'lock',
  'trash',
  'edit',
  'filter',
  'calendar',
  'dots',
  'crosshair',
  'maximize',
  'map-pin',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

// 24x24 viewBox, stroke-only paths. Each entry is the inner SVG markup for
// that glyph — all share the same stroke/cap/join/fill attributes applied by
// the wrapping <svg>.
const PATHS: Record<IconName, React.ReactNode> = {
  check: <polyline points="5 13 10 18 19 7" />,
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12" y2="16" />
    </>
  ),
  'chevron-down': <polyline points="6 9 12 15 18 9" />,
  'chevron-right': <polyline points="9 6 15 12 9 18" />,
  'chevron-left': <polyline points="15 6 9 12 15 18" />,
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  map: (
    <>
      <polygon points="3 6 9 4 15 6 21 4 21 18 15 20 9 18 3 20 3 6" />
      <line x1="9" y1="4" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="20" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="9" r="2.75" />
      <path d="M15 14.2c2.6.4 4.5 2.3 5 5.8" />
    </>
  ),
  shield: <path d="M12 3 20 6v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z" />,
  file: (
    <>
      <path d="M6 2h8l4 4v16H6V2Z" />
      <polyline points="14 2 14 6 18 6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </>
  ),
  'wifi-off': (
    <>
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M5 13a10 10 0 0 1 3.5-2.5" />
      <path d="M12.5 6.1A13 13 0 0 1 19 9" />
      <line x1="12" y1="20" x2="12" y2="20" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </>
  ),
  sparkle: <path d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10 12 2Z" />,
  send: <path d="M3 11 21 3 13 21 11 13 3 11Z" />,
  sliders: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="16" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="11" cy="18" r="2" />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 3 21 8 12 13 3 8 12 3" />
      <polyline points="3 13 12 18 21 13" />
      <polyline points="3 17.5 12 22.5 21 17.5" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V3" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </>
  ),
  broadcast: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.3 5.3a9.5 9.5 0 0 0 0 13.4" />
      <path d="M18.7 5.3a9.5 9.5 0 0 1 0 13.4" />
    </>
  ),
  truck: (
    <>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l4 3v3h-8z" />
      <circle cx="7" cy="18.5" r="1.5" />
      <circle cx="18" cy="18.5" r="1.5" />
    </>
  ),
  'arrow-up': (
    <>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="6 11 12 5 18 11" />
    </>
  ),
  'arrow-down': (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6 13 12 19 18 13" />
    </>
  ),
  external: (
    <>
      <path d="M10 5H5v14h14v-5" />
      <path d="M14 4h6v6" />
      <line x1="20" y1="4" x2="10" y2="14" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="1.5" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  edit: (
    <>
      <path d="M3 21v-4l12-12 4 4-12 12H3Z" />
      <line x1="14" y1="6" x2="18" y2="10" />
    </>
  ),
  filter: <polygon points="3 4 21 4 14 13 14 20 10 18 10 13 3 4" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1.25" />
      <circle cx="12" cy="12" r="1.25" />
      <circle cx="19" cy="12" r="1.25" />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </>
  ),
  maximize: (
    <>
      <polyline points="9 4 4 4 4 9" />
      <polyline points="15 4 20 4 20 9" />
      <polyline points="9 20 4 20 4 15" />
      <polyline points="15 20 20 20 20 15" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
};

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'name'> {
  /** Required. The icon to render — must be one of Icon.names. */
  name: IconName;
  /** sm=16px, default=20px, lg=24px. */
  size?: IconSize;
  /**
   * Pass only when the icon stands alone and carries meaning (no adjacent
   * text). When present, renders role="img" aria-label={label}. When absent,
   * renders aria-hidden="true" — the adjacent text carries the meaning.
   */
  label?: string;
}

function IconComponent(
  { name, size = 'default', label, className, style, ...rest }: IconProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const px = SIZE_PX[size];
  const a11yProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': 'true' as const };

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width={px}
      height={px}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={className}
      style={style}
      {...a11yProps}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

type IconComponentType = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
> & { names: typeof ICON_NAMES };

export const Icon = React.forwardRef(IconComponent) as IconComponentType;

Icon.names = ICON_NAMES;
