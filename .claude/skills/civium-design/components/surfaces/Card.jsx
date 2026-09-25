import React from 'react';
import { Eyebrow } from '../type/Eyebrow.jsx';

export function Card({ eyebrow, eyebrowGold = false, hint, clickable = false, onClick, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const lift = clickable && hover ? { boxShadow: 'var(--shadow-2)', borderColor: '#d5c9a9' } : {};
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)', padding: '14px 16px', boxShadow: 'var(--shadow-1)', cursor: clickable ? 'pointer' : undefined, ...lift, ...style }} {...rest}>
      {eyebrow != null && <Eyebrow gold={eyebrowGold} style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow>}
      {hint != null && <div style={{ font: '11px/1.4 var(--font-sans)', color: 'var(--fade)', marginBottom: 8 }}>{hint}</div>}
      {children}
    </div>
  );
}
