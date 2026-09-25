import React from 'react';

export function Input({ as = 'input', state = 'default', label, unit, options = [], disabled = false, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const base = { font: '12.5px var(--font-sans)', color: 'var(--ink)', padding: '4px 7px', border: '1px solid var(--line)', borderRadius: 'var(--radius-control)', background: '#fff', outline: 'none', fontVariantNumeric: 'tabular-nums lining-nums' };
  const st = state === 'bad' ? { borderColor: 'var(--red)', boxShadow: 'var(--ring-red)' }
    : state === 'busy' ? { borderColor: 'var(--gold)', background: 'var(--gold-wash)' }
    : focus ? { borderColor: 'var(--gold)', boxShadow: 'var(--ring)' } : {};
  const dis = disabled ? { background: 'var(--wash)' } : {};
  const common = { disabled, onFocus: () => setFocus(true), onBlur: () => setFocus(false), style: { ...base, ...st, ...dis, ...style }, ...rest };
  const field = as === 'select'
    ? <select {...common}>{options.map((o) => { const v = typeof o === 'string' ? { value: o, label: o } : o; return <option key={v.value} value={v.value}>{v.label}</option>; })}</select>
    : <input {...common} />;
  if (label == null && unit == null) return field;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '13px/1.45 var(--font-sans)', color: 'var(--ink)' }}>
      {label != null && <span>{label}</span>}
      {field}
      {unit != null && <span style={{ font: '11px/1.4 var(--font-sans)', color: 'var(--fade)' }}>{unit}</span>}
    </label>
  );
}
