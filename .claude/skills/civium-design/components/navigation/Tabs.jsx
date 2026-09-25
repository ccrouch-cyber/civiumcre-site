import React from 'react';

function TabButton({ label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ border: 'none', background: 'none', font: '14.5px/1.3 var(--font-serif)', padding: '7px 14px 9px', color: active ? 'var(--ink)' : hover ? 'var(--ink-soft)' : 'var(--fade)', borderBottom: '2px solid ' + (active ? 'var(--gold)' : 'transparent'), marginBottom: -1, cursor: 'pointer' }}>
      {label}
    </button>
  );
}

export function Tabs({ items = [], active, onChange, style }) {
  const list = items.map((it) => (typeof it === 'string' ? { id: it, label: it } : it));
  const cur = active ?? (list[0] && list[0].id);
  return (
    <div role="tablist" style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--line)', ...style }}>
      {list.map((it) => <TabButton key={it.id} label={it.label} active={it.id === cur} onClick={() => onChange && onChange(it.id)} />)}
    </div>
  );
}
