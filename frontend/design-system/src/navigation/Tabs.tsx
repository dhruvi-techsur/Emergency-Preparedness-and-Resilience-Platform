import * as React from 'react';
import './Tabs.css';

/**
 * EPMP Design System — Tabs (NAVIGATION)
 *
 * Switches between views of the same object. 2px brand underline on the
 * selected tab; Left/Right arrow keys move focus+selection between tabs.
 *
 * `Tabs` renders only the tab strip (role="tablist" on the container,
 * role="tab" per item, aria-selected). The caller pairs each tab with a
 * panel carrying role="tabpanel" — this component does not render panels.
 *
 * 2-6 tabs expected (not structurally enforced, documented per spec).
 */

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Active tab id. */
  value: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  const refs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  function focusTab(id: string) {
    refs.current.get(id)?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(index + 1) % tabs.length];
      onChange(next.id);
      focusTab(next.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(index - 1 + tabs.length) % tabs.length];
      onChange(prev.id);
      focusTab(prev.id);
    }
  }

  return (
    <div className="ep-tabs" role="tablist">
      {tabs.map((tab, index) => {
        const isSelected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) refs.current.set(tab.id, el);
              else refs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            id={`ep-tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`ep-tabpanel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            className={`ep-tabs__tab${isSelected ? ' ep-tabs__tab--selected' : ''}`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' ? (
              <span className="ep-tabs__count">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
