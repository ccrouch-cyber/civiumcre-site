import React from 'react';

export function Pill({ on = false, size = 'md', onClick, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = { borderRadius: 'var(--radius-pill)', padding: '4px 12px', font: '12px/1.4 var(--font-sans)', cursor: 'pointer', border: '1px solid var(--gold)', background: 'none', color: 'var(--gold-deep)' };
  const sm = size === 'sm' ? { padding: '2px 9px', fontSize: '10.5px', borderRadius: '11px' } : {};
  const onS = on ? { background: 'var(--gold)', color: 'var(--on-gold)' } : hover ? { background: 'var(--gold-wash)' } : {};
  return (
    <button type="button" aria-pressed={on} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sm, ...onS, ...style }} {...rest}>{children}</button>
  );
}
