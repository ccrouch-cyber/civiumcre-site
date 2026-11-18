// civiumcre.com — the visit script. It tells the app what a visitor does on this site, so the house can see which
// pages are read and where people stop: the page opened, where the visit came from, what is pressed, how far down the
// page, and the seconds the page is in front of someone. One address is posted to (COLLECT_URL) and nothing is asked
// back. WHAT IT NEVER DOES: it sets no cookie, reads nothing a person types, records no screen, and sends no address
// or name. A browser that asks not to be tracked (Global Privacy Control, Do Not Track) is given no id that outlasts
// the visit and carries none into the app. tools/check_site.sh holds these lines (rule 11).
(() => {
  'use strict';
  const COLLECT_URL = 'https://app.civiumcre.com/api/site/collect';
  const APP_ORIGIN = 'https://app.civiumcre.com';
  const MARKS = [25, 50, 75, 100];        // how far down a page, as the house counts it
  const PING_MS = 30000;                  // seconds in front of a page are reported this often, and when the page hides
  const PINGS_MAX = 60;
  const IDLE_MS = 60000;                  // a page nobody has touched this long is no longer counted as read
  const BATCH = 24;

  const store = (kind, key, make) => {    // a value kept in the browser's own storage, or made for this page alone
    try {
      const s = window[kind];
      let v = s.getItem(key);
      if (!v && make) { v = make(); s.setItem(key, v); }
      return v || '';
    } catch (e) { return make ? make() : ''; }
  };
  const put = (kind, key, v) => { try { window[kind].setItem(key, v); } catch (e) { /* storage is off: the visit alone */ } };
  const hex = () => {
    const b = new Uint8Array(8);
    (window.crypto || window.msCrypto).getRandomValues(b);
    return Array.from(b, x => ('0' + x.toString(16)).slice(-2)).join('');
  };
  const quiet = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';

  const params = new URLSearchParams(location.search);
  if (params.get('embed') === '1') return;   // the window framed inside the app's demo is the app's visit, not the site's
  const session = store('sessionStorage', 'civium.s', hex);
  const visitor = quiet ? '' : store('localStorage', 'civium.v', hex);
  let key = params.get('k') || '';
  if (/^[A-Za-z0-9]{4,16}$/.test(key)) {
    put('sessionStorage', 'civium.k', key);
    if (!quiet) put('localStorage', 'civium.k', key);
    params.delete('k');                   // the key leaves the address once read: a copied address names nobody
    const rest = params.toString();
    history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
  } else key = store('sessionStorage', 'civium.k') || (quiet ? '' : store('localStorage', 'civium.k'));

  const page = location.pathname.slice(0, 120);
  let queue = [];
  const send = () => {
    while (queue.length) {
      const body = JSON.stringify({ s: session, v: visitor, k: key, e: queue.splice(0, BATCH) });
      try {
        fetch(COLLECT_URL, { method: 'POST', body, keepalive: true, credentials: 'omit', mode: 'no-cors',
          referrerPolicy: 'strict-origin-when-cross-origin', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
      } catch (e) { /* a browser without keepalive: the line is lost, the page is not */ }
    }
  };
  let timer = 0;
  const note = (t, more) => {
    queue.push(Object.assign({ t, p: page }, more));
    if (queue.length >= BATCH) { send(); return; }
    clearTimeout(timer);
    timer = setTimeout(send, 2000);
  };

  // The page opened: where the visit came from (another site's host, never its whole address; a link's campaign words).
  let from = '';
  try { const r = new URL(document.referrer); if (r.host !== location.host) from = r.host.toLowerCase(); } catch (e) { from = ''; }
  const word = name => (params.get(name) || '').slice(0, 60);
  let zone = '';
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { zone = ''; }
  note('view', { r: from, us: word('utm_source'), um: word('utm_medium'), uc: word('utm_campaign'),
    w: window.innerWidth, h: window.innerHeight, tz: zone, l: (navigator.language || '').slice(0, 12) });

  // What is pressed: a link's or a button's own words and where it leads. Nothing typed is read.
  const leadsTo = a => {
    try {
      const u = new URL(a.href, location.href);
      if (u.protocol === 'mailto:') return 'mailto';
      if (u.origin === location.origin) return (u.pathname + u.search).slice(0, 160);
      // a link into the app: its page and plan, never the visit's id this script may have put on it
      if (u.origin === APP_ORIGIN) return ('app:' + u.pathname + u.search + (/^#sv=/.test(u.hash) ? '' : u.hash)).slice(0, 160);
      return u.host.slice(0, 160);
    } catch (e) { return ''; }
  };
  document.addEventListener('click', e => {
    const el = e.target && e.target.closest ? e.target.closest('a, button, summary, [role="button"], [data-track]') : null;
    if (!el) return;
    touched();
    const label = (el.getAttribute('data-track') || el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const a = el.closest('a[href]');
    const go = a ? a.getAttribute('data-gs-go') || a.getAttribute('data-go') : '';
    const to = a ? leadsTo(a) : '';
    if (a && !quiet) {
      // A link to the app's sign-up page carries this visit's id, so the house can tell which visits became accounts.
      // It rides the address's hash, which is never sent to a server; a browser that asks not to be tracked carries none.
      try {
        const u = new URL(a.href, location.href);
        if (u.origin === APP_ORIGIN && u.pathname === '/signup' && !u.hash) { u.hash = 'sv=' + session; a.href = u.toString(); }
      } catch (err) { /* not an address: left as it is */ }
    }
    note('click', { n: label, to });
    if (go) note('step', { n: 'start:go:' + go });
    if (a) send();                        // the page may be about to leave
  }, true);

  // How far down the page: each mark once.
  const reached = {};
  const depth = () => {
    const doc = document.documentElement;
    const pct = Math.min(100, Math.round((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1) * 100));
    MARKS.forEach(m => { if (pct >= m && !reached[m]) { reached[m] = true; note('scroll', { d: m }); } });
  };
  window.addEventListener('scroll', () => { touched(); depth(); }, { passive: true });
  setTimeout(depth, 2000);

  // The seconds the page is in front of someone: counted while it shows and someone has touched it lately.
  let since = document.visibilityState === 'visible' ? Date.now() : 0;
  let last = Date.now();
  let pings = 0;
  function touched() { last = Date.now(); if (!since && document.visibilityState === 'visible') since = last; }
  const report = () => {
    if (!since) return;
    const until = Math.min(Date.now(), last + IDLE_MS);
    const ms = until - since;
    since = until < Date.now() ? 0 : until;
    if (ms > 500) note('time', { ms });
  };
  ['pointermove', 'pointerdown', 'touchstart'].forEach(name => window.addEventListener(name, touched, { passive: true }));
  setInterval(() => { if (pings < PINGS_MAX && since) { pings += 1; report(); } }, PING_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { report(); since = 0; send(); } else { since = Date.now(); last = since; }
  });
  window.addEventListener('pagehide', () => { report(); send(); });

  // The Get started window: opened, its booking view, closed. site.js builds it; this only watches it.
  const watch = d => {
    let open = false;
    let book = false;
    const look = () => {
      if (d.open !== open) { open = d.open; note('step', { n: open ? 'start:open' : 'start:close' }); }
      const b = d.querySelector('.gs-book');
      const showing = !!b && !b.hidden && d.open;
      if (showing !== book) { book = showing; if (book) note('step', { n: 'start:book' }); }
    };
    new MutationObserver(look).observe(d, { attributes: true, subtree: true, attributeFilter: ['open', 'hidden'] });
    look();
  };
  const found = () => { const d = document.querySelector('dialog.gs'); if (d) { watch(d); return true; } return false; };
  if (!found()) {
    const seen = new MutationObserver(() => { if (found()) seen.disconnect(); });
    seen.observe(document.body, { childList: true });
  }
})();
