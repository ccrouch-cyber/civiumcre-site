import React from 'react';

export function Eyebrow({ gold = false, as = 'div', style, children, ...rest }) {
  const El = as;
  return (
    <El style={{ font: '10.5px/1.3 var(--font-sans)', letterSpacing: '1.6px', textTransform: 'uppercase', color: gold ? 'var(--gold-deep)' : 'var(--fade)', margin: 0, ...style }} {...rest}>{children}</El>
  );
}
