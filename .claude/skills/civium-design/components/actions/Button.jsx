import React from 'react';

const btnVariants = {
  primary: { rest: { background: 'var(--gold)', color: 'var(--on-gold)' }, hover: { background: 'var(--gold-deep)' } },
  ghost: { rest: { background: 'none', borderColor: 'var(--gold)', color: 'var(--gold-deep)' }, hover: { background: 'var(--gold-wash)' } },
  ink: { rest: { background: 'var(--ink)', color: 'var(--on-gold)' }, hover: { background: '#453e33' } },
  link: { rest: { background: 'none', border: 'none', color: 'var(--gold-deep)', fontSize: '12.5px', padding: 0 }, hover: {} },
};

export function Button({ variant = 'primary', size = 'md', disabled = false, type = 'button', onClick, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const v = btnVariants[variant] || btnVariants.primary;
  const base = { font: '12.5px/1.3 var(--font-sans)', borderRadius: 'var(--radius-control)', cursor: disabled ? 'default' : 'pointer', padding: '6px 14px', border: '1px solid transparent', fontVariantNumeric: 'tabular-nums lining-nums' };
  const sm = size === 'sm' && variant !== 'link' ? { padding: '3px 10px', fontSize: '11.5px', borderRadius: 'var(--radius-control-sm)' } : {};
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...v.rest, ...sm, ...(hover && !disabled ? v.hover : {}), ...(disabled ? { opacity: 0.45 } : {}), ...style }} {...rest}>
      {children}
    </button>
  );
}
