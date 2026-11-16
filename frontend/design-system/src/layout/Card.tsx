import * as React from 'react';
import './Card.css';

/**
 * EPMP Design System — Card (LAYOUT)
 *
 * The single container for grouped content. 1px border, 10px radius, no
 * shadow at rest — shadows do not separate surfaces, borders do. Optional
 * header (title/subtitle/actions) and footer. `padded={false}` lets a table
 * or list go edge to edge inside the card.
 *
 * `interactive` adds a hover border and makes the whole card a focusable
 * link — when true, either `href` (renders an `<a>` wrapper) or `onClick`
 * (renders a `<button>`-like clickable `<div role="button">`) must be
 * supplied, so the whole-card affordance is always keyboard reachable.
 *
 * Never nest a Card inside a Card — use a divider or a `bg-subtle` panel
 * instead. Never add a colored side border or gradient; emphasis comes from
 * a Badge or Alert inside the card.
 */

interface CardBaseProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Header-row actions (Buttons/IconButtons), rendered right-aligned. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  /** Default true. Set false for edge-to-edge tables/lists. */
  padded?: boolean;
  className?: string;
}

interface CardStaticProps extends CardBaseProps {
  interactive?: false;
  href?: undefined;
  onClick?: undefined;
}

interface CardInteractiveLinkProps extends CardBaseProps {
  interactive: true;
  href: string;
  onClick?: never;
}

interface CardInteractiveClickProps extends CardBaseProps {
  interactive: true;
  href?: undefined;
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export type CardProps = CardStaticProps | CardInteractiveLinkProps | CardInteractiveClickProps;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const { children, title, subtitle, actions, footer, padded = true, className, interactive } =
    props;

  const classes = [
    'ep-card',
    padded ? 'ep-card--padded' : '',
    interactive ? 'ep-card--interactive' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(title || subtitle || actions);

  const header = hasHeader ? (
    <div className="ep-card__header">
      <div className="ep-card__heading">
        {title ? <h3 className="ep-card__title">{title}</h3> : null}
        {subtitle ? <p className="ep-card__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ep-card__actions">{actions}</div> : null}
    </div>
  ) : null;

  const body = (
    <>
      {header}
      <div className="ep-card__body">{children}</div>
      {footer ? <div className="ep-card__footer">{footer}</div> : null}
    </>
  );

  if (interactive) {
    if ('href' in props && props.href) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} href={props.href}>
          {body}
        </a>
      );
    }
    const onActivate = 'onClick' in props ? props.onClick : undefined;
    return (
      <div
        ref={ref}
        className={classes}
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onActivate?.(event);
          }
        }}
      >
        {body}
      </div>
    );
  }

  return (
    <div ref={ref} className={classes}>
      {body}
    </div>
  );
});
