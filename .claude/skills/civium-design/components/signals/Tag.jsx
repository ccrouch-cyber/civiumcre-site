import React from 'react';

const tagTones = {
  default: {},
  good: { color: 'var(--green)', borderColor: 'var(--green)', background: 'var(--green-wash)' },
  warn: { color: 'var(--red)', borderColor: 'var(--red)', background: 'var(--red-wash)' },
  gold: { background: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--on-gold)' },
  assume: { color: 'var(--amber)', borderColor: 'var(--gold-soft)', fontSize: '9px' },
};

export function Tag({ tone = 'default', style, children, ...rest }) {
  const base = { display: 'inline-block', font: '10px/1.3 var(--font-sans)', color: 'var(--fade)', border: '1px solid var(--line)', borderRadius: 'var(--radius-tag)', padding: '1px 8px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums lining-nums' };
  return <span style={{ ...base, ...(tagTones[tone] || {}), ...style }} {...rest}>{children}</span>;
}
