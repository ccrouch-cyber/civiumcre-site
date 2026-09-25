const { Card: DkCard, Eyebrow: DkEyebrow, Pill: DkPill, Tag: DkTag, Button: DkButton } = window.CiviumDesignSystem_be8662;
function Desk({ onOpen }) {
  const [filter, setFilter] = React.useState('all');
  const [dropped, setDropped] = React.useState(false);
  const showDeal = filter === 'all' || filter === 'ready';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 16, alignItems: 'start' }}>
      <DkCard eyebrow="Drop a deal" eyebrowGold hint="it reads on the server and lands as a deal when it is ready; anything the reader cannot settle goes to Civium, and you hear within a day">
        <div onClick={() => setDropped(true)} style={{ padding: '14px 12px', textAlign: 'center', borderRadius: 'var(--radius-panel)', border: '1px dashed var(--faint)', cursor: 'pointer', background: dropped ? 'var(--gold-wash)' : undefined }}>
          {dropped ? 'reading…' : 'drop the workbooks (.xlsx / .xls) here — or press to choose'}
        </div>
      </DkCard>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <DkEyebrow>The deals</DkEyebrow>
          <div style={{ display: 'flex', gap: 10 }}>{['all', 'ready', 'with Civium'].map((x) => <DkPill key={x} on={filter === x} onClick={() => setFilter(x)}>{x}</DkPill>)}</div>
        </div>
        {showDeal ? (
          <DkCard clickable onClick={onOpen}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ font: 'var(--type-h-section)' }}>Larkspur Crossing</div>
              <DkTag>96 units</DkTag><DkTag tone="good">ready</DkTag>
            </div>
            <div style={{ marginTop: 8 }}><DkButton variant="link">→ open Larkspur Crossing</DkButton></div>
          </DkCard>
        ) : <div className="tiny mut">no deals with Civium</div>}
      </div>
    </div>
  );
}
window.Desk = Desk;
