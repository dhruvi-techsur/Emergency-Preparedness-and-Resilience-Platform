import * as React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import './PageHeader.css';

/**
 * EPMP Design System — PageHeader (NAVIGATION)
 *
 * Top of every page: breadcrumbs, one `h1` (32px), optional subtitle and
 * status, and a single actions group at right.
 *
 * **This is the only component in the entire design system that renders an
 * `<h1>`.** No other component in this library ever renders one — that
 * invariant is what makes "exactly one h1 per page" achievable, as long as
 * every page composes exactly one `PageHeader`. It is enforced by this file
 * being the sole owner of the `<h1>` element and by code review across the
 * rest of the library; grep for `<h1` across `src/` and this file is the
 * only match.
 *
 * **`actions` ordering contract:** `actions` is an array of already-built
 * `Button`/`IconButton` elements, rendered right-aligned **in the order
 * passed, with no reordering by this component**. Per the design system's
 * "primary action last" convention, the calling page is responsible for
 * passing its primary action as the final element of the array — PageHeader
 * does not know which action is "primary" and will not infer it.
 */

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Required. Renders as the page's one and only <h1>. */
  title: React.ReactNode;
  /** Passed straight through to Breadcrumbs. */
  crumbs?: BreadcrumbItem[];
  /** Rendered as body text under the title. */
  subtitle?: React.ReactNode;
  /** A Badge element rendered beside the title. */
  status?: React.ReactNode;
  /**
   * Page-level actions only (row actions live in the row, not here).
   * Caller passes the primary action last — see file-header TSDoc.
   */
  actions?: React.ReactNode[];
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, crumbs, subtitle, status, actions, className, ...rest },
  ref,
) {
  const classes = ['ep-page-header', className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {crumbs && crumbs.length > 0 ? (
        <Breadcrumbs items={crumbs} className="ep-page-header__crumbs" />
      ) : null}
      <div className="ep-page-header__row">
        <div className="ep-page-header__heading">
          <div className="ep-page-header__title-row">
            <h1 className="ep-page-header__title h1">{title}</h1>
            {status ? <span className="ep-page-header__status">{status}</span> : null}
          </div>
          {subtitle ? <p className="ep-page-header__subtitle body">{subtitle}</p> : null}
        </div>
        {actions && actions.length > 0 ? (
          <div className="ep-page-header__actions">
            {actions.map((action, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
});
