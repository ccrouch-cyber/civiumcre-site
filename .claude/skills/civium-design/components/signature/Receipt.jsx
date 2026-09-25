import React from 'react';
import { Eyebrow } from '../type/Eyebrow.jsx';

function ReceiptCard({ value, equation, source, rows = [], more, chainLabel, onOpenChain, style }) {
  const td = { padding: '2px 10px 2px 0' };
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)', padding: '14px 16px', boxShadow: 'var(--shadow-1)', minWidth: 360, textAlign: 'left', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums lining-nums', ...style }}>
      <Eyebrow gold style={{ marginBottom: 6 }}>The receipt</Eyebrow>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15 }}>{value} = {equation}</div>
      {source && <div style={{ font: '11px/1.4 var(--font-sans)', color: 'var(--fade)', marginTop: 8 }}>{source}</div>}
      {rows.length > 0 && (
        <table style={{ font: '11px/1.4 var(--font-sans)', marginTop: 6, borderCollapse: 'collapse' }}><tbody>
          {rows.map((r, i) => (
            <tr key={i} style={i % 2 ? { background: 'var(--zebra)' } : undefined}>
              <td style={td}>{r.label}</td><td style={{ textAlign: 'right' }}>{r.value}</td><td style={{ paddingLeft: 10, color: 'var(--fade)' }}>{r.origin}</td>
            </tr>
          ))}
          {more && <tr><td style={{ ...td, color: 'var(--fade)' }}>{more}</td><td></td><td></td></tr>}
        </tbody></table>
      )}
      <button type="button" onClick={onOpenChain} style={{ background: 'none', border: 'none', color: 'var(--gold-deep)', font: '12.5px/1.3 var(--font-sans)', padding: 0, cursor: 'pointer', marginTop: 8, display: 'block' }}>{chainLabel}</button>
    </div>
  );
}

export function Receipt({ value, label, size = 'metric', equation, source, rows, more, chainLabel = '→ open the chain', onOpenChain, mode = 'hover', style }) {
  const [open, setOpen] = React.useState(false);
  const num = (
    <span style={{ font: size === 'metric' ? '19px/1.15 var(--font-serif)' : '13px/1.45 var(--font-sans)', borderBottom: '1px dotted var(--gold-deep)', display: 'inline-block', cursor: 'help', fontVariantNumeric: 'tabular-nums lining-nums' }}>{value}</span>
  );
  const card = <ReceiptCard value={value} equation={equation} source={source} rows={rows} more={more} chainLabel={chainLabel} onOpenChain={onOpenChain} />;
  if (mode === 'static') {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', ...style }}>
        <div>{label && <Eyebrow>{label}</Eyebrow>}{num}</div>{card}
      </div>
    );
  }
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {label && <Eyebrow>{label}</Eyebrow>}
      {num}
      {open && <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 6, zIndex: 20 }}>{React.cloneElement(card, { style: { boxShadow: 'var(--shadow-2)' } })}</div>}
    </span>
  );
}
