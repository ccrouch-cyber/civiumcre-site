const { Button } = window.CiviumDesignSystem_be8662;
function Shell({ children, onSignOut }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <header style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ font: 'var(--type-brand)', letterSpacing: 7, color: 'var(--gold)' }}>CIVIUM</div>
          <Button variant="ghost" onClick={onSignOut}>sign out</Button>
        </div>
      </header>
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 48px', boxSizing: 'border-box' }}>{children}</main>
    </div>
  );
}
window.Shell = Shell;
