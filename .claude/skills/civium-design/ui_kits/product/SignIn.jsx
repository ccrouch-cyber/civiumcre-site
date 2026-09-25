const { Card: SiCard, Input: SiInput, Button: SiButton } = window.CiviumDesignSystem_be8662;
function SignIn({ onEnter }) {
  const [busy, setBusy] = React.useState(false);
  const enter = () => { setBusy(true); setTimeout(onEnter, 700); };
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ width: 360, display: 'grid', gap: 16 }}>
        <div style={{ font: 'var(--type-brand)', letterSpacing: 7, color: 'var(--gold)', textAlign: 'center' }}>CIVIUM</div>
        <SiCard>
          <div style={{ display: 'grid', gap: 10 }}>
            <SiInput defaultValue="x@x.test" aria-label="email" />
            <SiInput type="password" defaultValue="correct horse battery staple" aria-label="password" />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <SiButton disabled={busy} onClick={enter}>{busy ? 'sending…' : 'Set password and enter'}</SiButton>
            </div>
            <div className="tiny mut">shown once — send it yourself</div>
          </div>
        </SiCard>
      </div>
    </div>
  );
}
window.SignIn = SignIn;
