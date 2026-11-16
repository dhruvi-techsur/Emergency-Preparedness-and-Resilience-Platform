import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './Breadcrumbs.css';

/**
 * EPMP Design System — Breadcrumbs (NAVIGATION)
 *
 * Shows the path to the current page. Muted links, chevron separators,
 * current page in bold with `aria-current="page"`. The last item is the
 * current page and is never a link — this is enforced structurally, not by
 * convention: regardless of whether the last item carries an `href`, it
 * always renders as plain text.
 *
 * Use on any page 3+ levels deep. Keep each label identical to the
 * destination page's title.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, className, ...rest },
  ref,
) {
  const classes = ['ep-breadcrumbs', className ?? ''].filter(Boolean).join(' ');

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={classes} {...rest}>
      <ol className="ep-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="ep-breadcrumbs__item">
              {isLast ? (
                <span className="ep-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a className="ep-breadcrumbs__link" href={item.href}>
                  {item.label}
                </a>
              )}
              {!isLast ? (
                <Icon
                  name="chevron-right"
                  size="sm"
                  aria-hidden="true"
                  className="ep-breadcrumbs__sep"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
