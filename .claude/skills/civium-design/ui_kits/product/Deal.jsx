const { Tabs: DlTabs, Card: DlCard, Eyebrow: DlEyebrow, Receipt: DlReceipt, Tag: DlTag, Button: DlButton } = window.CiviumDesignSystem_be8662;
const dlRows = [
  { unit: '1101', plan: 'A1', rent: '$1,205', origin: 'Sheet1!7 · Market Rent' },
  { unit: '1102', plan: 'A1', rent: '$1,205', origin: 'Sheet1!8 · Market Rent' },
];
function Deal({ onBack }) {
  const [lane, setLane] = React.useState('Rent Roll Analyzer');
  const th = { textAlign: 'left', font: 'var(--type-eyebrow)', letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--fade)', fontWeight: 400, padding: '6px 10px', borderBottom: '1px solid var(--line)' };
  const td = { padding: '6px 10px', borderBottom: '1px solid var(--line-soft)' };
  return (
    <div>
      <DlButton variant="link" onClick={onBack}>← deals</DlButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 14px' }}>
        <h1 style={{ font: 'var(--type-h-page)', margin: 0 }}>Larkspur Crossing</h1><DlTag tone="good">ready</DlTag>
      </div>
      <DlTabs items={['Rent Roll Analyzer', 'T-12 Analyzer', 'Market', 'Underwriting', 'The deal in one page']} active={lane} onChange={setLane} />
      {lane === 'Rent Roll Analyzer' ? (
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <DlCard>
            <div style={{ display: 'flex', gap: 48 }}>
              <div><DlEyebrow>Units</DlEyebrow><div className="metric">96</div></div>
              <DlReceipt label="Market rent / month" value="$137,040" equation="Σ market rent over 96 units" source="from the rent roll's own unit lines"
                rows={dlRows.map((r) => ({ label: r.unit + ' · ' + r.plan, value: r.rent, origin: r.origin }))} more="… 94 more" />
              <DlReceipt label="Market rent / unit" value="$1,427.50" equation="$137,040 ÷ 96 units" source="the two numbers beside it" />
            </div>
            <div className="tiny mut" style={{ marginTop: 10 }}>96 units read; every row classed.</div>
          </DlCard>
          <DlCard eyebrow="Unit lines">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={th}>Unit</th><th style={th}>Plan</th><th style={{ ...th, textAlign: 'right' }}>Market rent</th><th style={th}>Origin</th></tr></thead>
              <tbody>{dlRows.map((r, i) => (
                <tr key={r.unit} style={i % 2 ? { background: 'var(--zebra)' } : undefined}>
                  <td style={td}>{r.unit}</td><td style={td}>{r.plan}</td><td style={{ ...td, textAlign: 'right' }}>{r.rent}</td><td style={{ ...td, color: 'var(--fade)' }} className="tiny">{r.origin}</td>
                </tr>))}
                <tr><td style={{ ...td, color: 'var(--fade)' }} colSpan={4}>… 94 more</td></tr>
              </tbody>
            </table>
          </DlCard>
        </div>
      ) : (
        <div className="tiny mut" style={{ marginTop: 16 }}>This lane is not recreated — the product repository is private and its screens were not available.</div>
      )}
    </div>
  );
}
window.Deal = Deal;
