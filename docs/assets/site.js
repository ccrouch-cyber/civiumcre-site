const CONFIG = {
  CTA_LABEL: 'Get started',     // the words on every button that opens the Get started window
  DEMO_URL: 'https://app.civiumcre.com/#demo',                 // Open the demo
  FREE_URL: 'https://app.civiumcre.com/signup?plan=free',      // Start free
  TRIAL_URL: 'https://app.civiumcre.com/signup?plan=trial',    // Start the trial
  CIVIUM_URL: 'https://app.civiumcre.com/signup?plan=civium',  // Start Civium, on Pricing; Yearly adds interval=year
  SIGN_IN_URL: 'https://app.civiumcre.com/',                   // the app's sign-in; '' = the link is not rendered
  SIGN_IN_LABEL: 'Client portal',                              // the sign-in link's words, one string
  PRICING_URL: '/pricing/',                                    // See pricing and Ready to buy, inside the window
  APP_ORIGIN: 'https://app.civiumcre.com',                     // the one page told that the framed window closed (/start/?embed=1)
  SCHEDULER_URL: '',            // the scheduling page the booking view frames; '' = each booking button writes to TALK_MAIL
  TALK_MAIL: 'mailto:ccrouch@civiumcre.com'                    // where the booking buttons write until SCHEDULER_URL is set
};

// civiumcre.com — the site's one script. Above: the site's switches. Below: the copy they print, the sign-in link,
// the Get started window (the overlay on Home and Pricing, and the page /start/), the old pages' parts (the sample
// page, the grain, the receipt cards and the value bridge, which no page uses now), Pricing's billing toggle, Home's
// own parts (design_handoff_homepage/README.md: the wordmark's way back to the top, the numbers, lines, walkthrough
// and trust mock) and the motion; with prefers-reduced-motion set, no motion runs and the first state of each part
// shows. This script asks the network for nothing: it sets links, builds the window and moves what is on the page.
(() => {
  'use strict';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.2,.7,.2,1)';

  // The copy the configuration prints: the words on every button that opens the Get started window.
  $$('[data-cta]').forEach(el => { el.textContent = CONFIG.CTA_LABEL; });

  // The sign-in link: SIGN_IN_LABEL, in the nav's link style before the primary button, when SIGN_IN_URL is set.
  if (CONFIG.SIGN_IN_URL) $$('.header .nav').forEach(nav => {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = CONFIG.SIGN_IN_URL;
    a.textContent = CONFIG.SIGN_IN_LABEL;
    nav.insertBefore(a, $('[data-cta]', nav));
  });
  // The footers' sign-in link and the header's divider before it follow the same switch.
  $$('[data-sign-in]').forEach(a => {
    if (!CONFIG.SIGN_IN_URL) { a.remove(); return; }
    a.href = CONFIG.SIGN_IN_URL;
    a.textContent = CONFIG.SIGN_IN_LABEL;
    a.hidden = false;
  });
  if (!CONFIG.SIGN_IN_URL) $$('[data-sign-in-sep]').forEach(el => el.remove());

  // The Get started window (the newer sign-up design: "Get started window" and "Booking view"). Built here once, on
  // first use, for three places: the overlay on Home and Pricing, the page /start/ (the window alone), and
  // /start/?embed=1, which the app's demo frames. Framed, the ground is clear, the app previews are left out, every
  // link opens in the top window, Open the demo only closes, and a close is told to the app and to nobody else.
  const params = new URLSearchParams(location.search);
  const startPage = $('[data-gs-page]');
  const embed = !!startPage && params.get('embed') === '1';
  const GO = { demo: CONFIG.DEMO_URL, free: CONFIG.FREE_URL, trial: CONFIG.TRIAL_URL, signin: CONFIG.SIGN_IN_URL, pricing: CONFIG.PRICING_URL };
  const PREVIEW = {   // the app previews: the design's sample app at 1280x800, the screen the design frames in each panel
    demo: '<div class="gs-preview" aria-hidden="true"><img src="/assets/start/demo-1280.webp" srcset="/assets/start/demo-1280.webp 1280w, /assets/start/demo-1920.webp 1920w" sizes="704px" width="704" height="440" alt="" loading="lazy"></div>',
    free: '<div class="gs-preview" aria-hidden="true"><img src="/assets/start/free-1280.webp" srcset="/assets/start/free-1280.webp 1280w, /assets/start/free-1920.webp 1920w" sizes="704px" width="704" height="440" alt="" loading="lazy"></div>',
    trial: '<div class="gs-preview" aria-hidden="true"><img src="/assets/start/trial-1280.webp" srcset="/assets/start/trial-1280.webp 1280w, /assets/start/trial-1920.webp 1920w" sizes="704px" width="704" height="440" alt="" loading="lazy"></div>'
  };
  const PANELS = [   // the four ways in: [kind, title, the line under it, the list, the button's words]
    ['demo', 'Civium Demo', 'Click around one of our deals. See how we underwrite.', [], 'Open the demo'],
    ['meet', 'Book a meeting', 'A 30-minute call with our team. Talk about your deals and your workflow with us. See how we can help.', [], 'Talk with our team'],
    ['free', 'Civium Free', 'Start with one deal', ['No card required', 'One deal of your own', 'Comps where Civium already has them'], 'Start free'],
    ['trial', 'Civium Trial', 'Start with everything', ['Card required', 'Up to five deals over 14 days', 'Sharing and your relationship book', 'Then Civium, at $1,500 a month'], 'Start the trial']
  ];
  const TOPICS = {   // the booking view's words, by topic: [the line over the title, the title, the line under it]
    demo: ['Talk with our team', 'Pick a time with Caden.', '30 minutes on a video call. Bring a deal if you have one.'],
    team: ['Teams', 'Talk to Caden about your team.', '30 minutes on a video call about seats, setup and pricing for your team.'],
    custom: ['Civium Custom', 'Civium Custom starts with a call.', 'Civium Custom is Civium plus monthly customizations from your own list, and meetings with Caden. It is priced to what you need. Bring the list.']
  };
  const WORDS = {   // the rest of the window's words
    heading: 'Get started', lead: 'Get familiar with Civium at your pace.', buy: 'Ready to buy →',
    open: 'No account needed', withAccount: 'With an account',
    account: 'Already have an account?', signin: 'Client portal →', pricing: 'See pricing →',
    back: '← All the ways to start', meta: ['30 minutes', 'Video call']
  };
  let gs = null;

  const buildStart = () => {
    const d = document.createElement('dialog');
    d.className = 'gs' + (embed ? ' gs--embed' : startPage ? ' gs--alone' : '');
    d.setAttribute('aria-labelledby', 'gs-title');
    // A panel's one button: a link into the app, or (Open the demo, framed) a close, or the way to the booking view.
    const button = (kind, words) => {
      if (kind === 'demo' && embed) return '<button type="button" class="gs-btn" data-gs-close>' + words + '</button>';
      if (kind !== 'meet') return '<a class="gs-btn" data-gs-go="' + kind + '">' + words + '</a>';
      if (CONFIG.SCHEDULER_URL) return '<button type="button" class="gs-btn" data-gs-book="demo">' + words + '</button>';
      return '<a class="gs-btn" data-gs-mail>' + words + '</a>';
    };
    const pane = ([kind, title, line, items, words]) => '<div class="gs-panel gs-panel--' + kind + '">'
      + '<div class="gs-panel-ground"></div><div class="gs-panel-grain"></div>'
      + (embed || !PREVIEW[kind] ? '' : PREVIEW[kind])
      + '<div class="gs-panel-text"><h3 class="gs-panel-title">' + title + '</h3><p class="gs-panel-line">' + line + '</p>'
      + (items.length ? '<ul class="gs-list">' + items.map(t => '<li>' + t + '</li>').join('') + '</ul>' : '')
      + button(kind, words) + '</div><div class="gs-panel-wash"></div></div>';
    const group = (eyebrow, panels, account) => '<div class="gs-group"><span class="gs-eyebrow">' + eyebrow + '</span>'
      + '<div class="gs-row' + (account ? ' gs-row--account' : '') + '">' + panels.map(pane).join('') + '</div></div>';
    d.innerHTML = '<div class="gs-card">'
      + '<div class="gs-side"><img class="gs-side-photo" src="/assets/photos/home-close-galleria.jpg" width="1600" height="2400" alt="">'
      + '<div class="gs-side-shade"></div><div class="gs-side-in"><span class="gs-wordmark">CIVIUM</span>'
      + '<div class="gs-intro" data-gs-view="choose"><h2 class="gs-title" id="gs-title" tabindex="-1">' + WORDS.heading + '</h2>'
      + '<p class="gs-line">' + WORDS.lead + '</p><a class="gs-buy" data-gs-go="pricing">' + WORDS.buy + '</a></div>'
      + '<div class="gs-intro gs-intro--book" data-gs-view="book" hidden><span class="gs-eyebrow gs-eyebrow--side" data-gs-topic="eyebrow"></span>'
      + '<h2 class="gs-title" id="gs-book-title" tabindex="-1" data-gs-topic="title"></h2></div></div></div>'
      + '<div class="gs-main"><button type="button" class="gs-close" aria-label="Close" data-gs-close>×</button>'
      + '<div class="gs-choose" data-gs-view="choose">' + group(WORDS.open, PANELS.slice(0, 2)) + group(WORDS.withAccount, PANELS.slice(2), true) + '</div>'
      + '<div class="gs-foot" data-gs-view="choose"><span data-gs-signin>' + WORDS.account + ' <a class="gs-foot-link" data-gs-go="signin">' + WORDS.signin + '</a></span>'
      + '<a class="gs-foot-link" data-gs-go="pricing">' + WORDS.pricing + '</a></div>'
      + '<div class="gs-book" data-gs-view="book" hidden><button type="button" class="gs-back" data-gs-back>' + WORDS.back + '</button>'
      + '<div class="gs-book-head"><p class="gs-book-sub" data-gs-topic="sub"></p>'
      + '<div class="gs-book-meta">' + WORDS.meta.map(t => '<span>' + t + '</span>').join('') + '</div></div>'
      + '<div class="gs-book-frame" data-gs-frame></div></div></div></div>';
    $$('[data-gs-go]', d).forEach(a => { a.href = GO[a.dataset.gsGo]; });
    $$('[data-gs-mail]', d).forEach(a => { a.href = CONFIG.TALK_MAIL; });
    if (!CONFIG.SIGN_IN_URL) $$('[data-gs-signin]', d).forEach(el => el.remove());
    if (embed) $$('a', d).forEach(a => { a.target = '_top'; });

    // Close: the × and, framed, Open the demo; a click outside the window. Esc closes the overlay by itself.
    d.addEventListener('click', e => {
      const t = e.target.closest('[data-gs-close], [data-gs-book], [data-gs-back]');
      if (!t) return;
      if (t.matches('[data-gs-close]')) closeStart();
      else if (t.matches('[data-gs-back]')) setView('choose');
      else setView('book', t.dataset.gsBook);
    });
    let downOutside = false;
    d.addEventListener('mousedown', e => { downOutside = e.target === d; });
    d.addEventListener('click', e => { if (e.target === d && downOutside) closeStart(); });
    d.addEventListener('close', closed);   // Esc closes the overlay without passing through closeStart

    // A panel widens while the pointer is on it or the keyboard is inside it, and its neighbour dims.
    const hold = (row, panel) => $$('.gs-panel', row).forEach(p => {
      p.classList.toggle('is-on', p === panel);
      p.classList.toggle('is-dim', !!panel && p !== panel);
    });
    const into = e => { const p = e.target.closest('.gs-panel'); if (p) hold(p.parentElement, p); };
    const outOf = e => {
      const p = e.target.closest('.gs-panel');
      if (!p) return;
      const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('.gs-panel') : null;
      if (to && to.parentElement === p.parentElement) return;
      hold(p.parentElement, null);
    };
    if (window.matchMedia('(hover: hover)').matches) { d.addEventListener('mouseover', into); d.addEventListener('mouseout', outOf); }
    d.addEventListener('focusin', into);
    d.addEventListener('focusout', outOf);
    return d;
  };

  // The booking view: its frame is made, and the scheduler's page asked for, only when the view first opens.
  const setView = (view, topic) => {
    const book = view === 'book' && !!CONFIG.SCHEDULER_URL;
    const t = TOPICS[topic] || TOPICS.demo;
    $$('[data-gs-view]', gs).forEach(el => { el.hidden = (el.dataset.gsView === 'book') !== book; });
    gs.setAttribute('aria-labelledby', book ? 'gs-book-title' : 'gs-title');
    if (book) {
      $$('[data-gs-topic]', gs).forEach(el => { el.textContent = { eyebrow: t[0], title: t[1], sub: t[2] }[el.dataset.gsTopic]; });
      let frame = $('[data-gs-frame] iframe', gs);
      if (!frame) {
        frame = document.createElement('iframe');
        frame.src = CONFIG.SCHEDULER_URL;
        $('[data-gs-frame]', gs).appendChild(frame);
      }
      frame.title = t[1];
    }
    if (!gs.open) return;
    gs.scrollTop = 0;
    $(book ? '#gs-book-title' : '#gs-title', gs).focus({ preventScroll: true });
  };
  const openStart = (view, topic) => {
    if (!gs) { gs = buildStart(); document.body.appendChild(gs); }
    if (!gs.open) {
      if (startPage) { startPage.hidden = true; gs.show(); }
      else { lockScroll(true); gs.showModal(); }
    }
    setView(view, topic);
  };
  const closeStart = () => {
    if (embed) { window.parent.postMessage({ civium: 'gs-close' }, CONFIG.APP_ORIGIN); setView('choose'); return; }
    if (startPage) { location.href = '/'; return; }
    gs.close();
    closed();
  };
  // After the overlay closes, however it closed: the page scrolls again, and ?start=1 leaves the address.
  const closed = () => {
    lockScroll(false);
    if (params.get('start') === '1') history.replaceState(null, '', location.pathname + location.hash);
  };
  // The page behind stays where it was while the overlay is open.
  const lockScroll = on => {
    const root = document.documentElement;
    root.style.paddingRight = on ? (window.innerWidth - root.clientWidth) + 'px' : '';
    root.style.overflow = on ? 'hidden' : '';
  };

  // Every Get started button opens the window; the booking buttons open its booking view, or write to TALK_MAIL
  // while there is no scheduler. Each stays a plain link too, for a new tab or a page without this script.
  const plain = e => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button;
  $$('[data-cta]').forEach(a => {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', e => { if (plain(e)) return; e.preventDefault(); openStart('choose'); });
  });
  $$('[data-book]').forEach(a => {
    if (!CONFIG.SCHEDULER_URL) { a.href = CONFIG.TALK_MAIL; return; }
    a.href = '/start/?view=book&topic=' + a.dataset.book;
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', e => { if (plain(e)) return; e.preventDefault(); openStart('book', a.dataset.book); });
  });
  $$('[data-go]').forEach(a => { a.href = GO[a.dataset.go]; });   // Pricing's Start free and Start the trial
  if (startPage) {
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStart(); });
    openStart(params.get('view'), params.get('topic'));
  } else if (params.get('start') === '1' && $('[data-cta]')) openStart(params.get('view'), params.get('topic'));

  // The sample page: one <template>, cloned into each slot (the hero stage and The record).
  const sample = $('#sample-page');
  if (sample) $$('[data-sample-slot]').forEach(slot => slot.appendChild(sample.content.cloneNode(true)));

  // The film grain: the README's inline SVG noise, applied to [data-grain] elements.
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
  const grain = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  $$('[data-grain]').forEach(el => { el.style.backgroundImage = grain; });

  // The receipt: the NOI and Cap cards take turns every 3.6s until the user hovers or clicks a formula button.
  const sources = $('[data-sources]');
  if (sources) {
    let src = 'noi';
    let userSrc = false;
    const show = () => ['noi', 'cap'].forEach(k => {
      const on = src === k;
      $$('[data-srccard="' + k + '"], [data-srcrow="' + k + '"], [data-srcbtn="' + k + '"]', sources)
        .forEach(el => el.classList.toggle('is-on', on));
      $$('[data-srcbtn="' + k + '"]', sources).forEach(b => b.setAttribute('aria-pressed', String(on)));
    });
    const pick = k => { userSrc = true; if (src !== k) { src = k; show(); } };
    $$('[data-srcbtn]', sources).forEach(b => {
      b.addEventListener('mouseenter', () => pick(b.dataset.srcbtn));
      b.addEventListener('click', () => pick(b.dataset.srcbtn));
    });
    if (!reduced) setInterval(() => { if (!userSrc) { src = src === 'noi' ? 'cap' : 'noi'; show(); } }, 3600);
  }

  // Pricing: the Monthly / Yearly toggle on the Civium card (two buttons with aria-pressed; Monthly is the default).
  // It swaps the price, its unit and the line under it, and Start Civium's address: Yearly adds interval=year.
  const billing = $$('[data-billing]');
  const setBilling = mode => {
    billing.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.billing === mode)));
    $$('[data-monthly]').forEach(el => { el.textContent = el.dataset[mode]; });
    $$('[data-go="civium"]').forEach(a => {
      const u = new URL(CONFIG.CIVIUM_URL);
      if (mode === 'yearly') u.searchParams.set('interval', 'year');
      a.href = u.href;
    });
  };
  if (billing.length || $('[data-go="civium"]')) setBilling('monthly');
  billing.forEach(b => b.addEventListener('click', () => setBilling(b.dataset.billing)));

  // The value bridge: rows 520ms apart, each fading and rising 10px over 600ms; each bar grows over 900ms while
  // its number counts up from 0 (ease-out cubic). Plays once at 35% visible; Replay runs it again.
  let bridgeRun = 0;
  const count = (el, delay, dur, run) => {
    const final = el.dataset.final || el.textContent;
    el.dataset.final = final;
    const n = +el.dataset.count, pre = el.dataset.pre || '';
    const start = performance.now() + delay;
    el.textContent = pre + '0';
    const tick = now => {
      if (run !== bridgeRun) return;
      const p = Math.min(1, Math.max(0, (now - start) / dur)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(n * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    requestAnimationFrame(tick);
  };
  const playBridge = () => {
    const run = ++bridgeRun;
    $$('[data-brow]').forEach((row, i) => {
      const t = 200 + i * 520;
      row.getAnimations({ subtree: true }).forEach(a => a.cancel());
      row.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 600, delay: t, easing: ease, fill: 'backwards' });
      const bar = $('[data-bar]', row);
      if (bar) bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 900, delay: t + 150, easing: ease, fill: 'backwards' });
      const c = $('[data-count]', row);
      if (c) count(c, t + 150, 900, run);
    });
  };

  // Home (design_handoff_homepage/README.md): the live numbers, the opening's lines and motion, the walkthrough and
  // the trust mock. Everything that moves checks reduced; with it set, each part shows its first state and clicks work.
  const homeRoot = $('.h-open') ? $('.h-root') : null;
  if (homeRoot) {
    const hEase = 'cubic-bezier(.22,.61,.24,1)';
    const turn = (el, yes) => el.classList.toggle('is-on', yes);

    // The wordmark: on Home it goes back to the top instead of reloading the page, and drops a #fragment.
    const mark = $('.h-open .wordmark');
    if (mark) mark.addEventListener('click', e => {
      e.preventDefault();
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    const load = img => {   // a screen held in data-src / data-srcset until its step comes up
      if (!img || !img.dataset.src) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      delete img.dataset.src;
      delete img.dataset.srcset;
    };

    // The live numbers: window.CIVIUM_STATS from /assets/stats.js. A missing, zero or non-number value keeps the dash
    // and "Not yet measured".
    const stats = window.CIVIUM_STATS || {};
    const statKey = { minutes: 'minutesAvg', dollars: 'dollarsUnderwritten' };
    const money = (v, d, unit) => '$' + (v / d).toFixed(v / d < 10 && unit === 'B' ? 1 : 0).replace(/\.0$/, '') + unit;
    const statText = {
      minutes: v => String(v < 10 ? Math.round(v * 10) / 10 : Math.round(v)),   // under ten minutes, one decimal (1.5, not 2)
      dollars: v => v >= 1e9 ? money(v, 1e9, 'B') : v >= 1e6 ? money(v, 1e6, 'M') : money(v, 1e3, 'K')
    };
    $$('[data-stat]', homeRoot).forEach(el => {
      const k = el.dataset.stat, v = stats[statKey[k]];
      if (typeof v !== 'number' || !isFinite(v) || v <= 0) return;
      const num = $('.h-stat-num', el), pill = $('.h-pill', el);
      num.textContent = statText[k](v);
      num.classList.remove('is-empty');
      if (pill) pill.remove();
    });

    // The opening's lines: 60 curves across a 1600x700 field, drawn once (styled by home.css).
    const lines = $('[data-lines]', homeRoot);
    if (lines) {
      const W = 1600, H = 700;
      const curve = (i, dir) => {
        let d = '';
        for (let x = 0; x <= W; x += 8) {
          const amp = 70 + 34 * Math.sin(i * .27 + dir);
          const y = H * .52 + Math.sin(x / 240 + dir * i * .17) * amp * Math.cos(x / 760 - i * .04 * dir) + (i - 15) * 6.5;
          d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
        }
        return '<path d="' + d + '"></path>';
      };
      let paths = '';
      for (let i = 0; i < 30; i++) paths += curve(i, 1);
      for (let i = 0; i < 30; i++) paths += curve(i, -1);
      lines.innerHTML = '<svg viewBox="0 0 1600 700" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g>' + paths + '</g></svg>';
    }

    // The trust mock is a 760x540 canvas, scaled to its box's width.
    const mock = $('[data-mock]', homeRoot);
    if (mock) {
      const canvas = mock.firstElementChild;
      const fit = () => { canvas.style.transform = 'scale(' + (mock.clientWidth / 760) + ')'; };
      fit();
      new ResizeObserver(fit).observe(mock);
    }

    // The opening: entrance, the photo's and the lines' slow drift, the two app screens 8s apart, the headline's
    // last word every 3.8s. The close's photo drifts the other way.
    if (!reduced) {
      $$('[data-in]', homeRoot).forEach(el => {
        const frame = el.hasAttribute('data-in-frame');
        el.animate([{ opacity: 0, transform: 'translateY(' + (frame ? 40 : 18) + 'px)' }, { opacity: 1, transform: 'none' }],
          { duration: frame ? 1500 : 1100, delay: +(el.dataset.in || 0), easing: hEase, fill: 'backwards' });
      });
      const svg = lines && $('svg', lines);
      if (svg) svg.animate([{ transform: 'translateX(-60px)' }, { transform: 'translateX(60px)' }],
        { duration: 26000, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
      const drift = (sel, to, ms) => {
        const el = $(sel, homeRoot);
        if (el) el.animate([{ transform: 'scale(1) translateX(0)' }, { transform: to }],
          { duration: ms, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
      };
      drift('[data-drift="open"]', 'scale(1.07) translateX(-1.6%)', 32000);
      drift('[data-drift="close"]', 'scale(1.06) translateX(1.4%)', 34000);
      const shots = $$('[data-shot]', homeRoot);
      if (shots.length > 1) {
        let k = 0;
        setInterval(() => { k = (k + 1) % shots.length; shots.forEach((s, j) => turn(s, j === k)); }, 8000);
      }
      const word = $('[data-word]', homeRoot);
      const WORDS = ['multifamily', 'brokers', 'buyers', 'lenders'];
      if (word) {
        let w = 0;
        setInterval(() => {
          w = (w + 1) % WORDS.length;
          const out = word.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-.18em)' }],
            { duration: 420, easing: 'ease-in', fill: 'forwards' });
          out.onfinish = () => {
            word.textContent = WORDS[w];
            out.cancel();
            word.animate([{ opacity: 0, transform: 'translateY(.18em)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: hEase });
          };
        }, 3800);
      }
    }

    // A week of underwriting: the step and its screen. Once 20% of the section is in view the steps advance every
    // 6.5s; a click shows that step and restarts the count. Step 1 drops two files in. The next screen loads 2.5s early.
    const steps = $$('[data-walk-step]', homeRoot), frames = $$('[data-walk-frame]', homeRoot), chips = $$('[data-walk-chip]', homeRoot);
    if (steps.length) {
      let cur = 0, walk = 0;
      const go = i => {
        cur = i;
        steps.forEach((s, j) => { turn(s, j === i); s.setAttribute('aria-pressed', String(j === i)); });
        frames.forEach((f, j) => { if (j === i) load(f); turn(f, j === i); });
        if (i === 0 && !reduced) chips.forEach((c, n) => {
          c.getAnimations().forEach(x => x.cancel());
          c.animate([
            { opacity: 0, transform: 'translate(260px,-150px) rotate(5deg)' },
            { opacity: 1, offset: .18 },
            { opacity: 1, transform: 'translate(0,0) rotate(0)', offset: .62 },
            { opacity: 1, transform: 'scale(.94)', offset: .8 },
            { opacity: 0, transform: 'scale(.9)' }
          ], { duration: 3000, delay: 700 + n * 450, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'both' });
        });
        setTimeout(() => load(frames[(i + 1) % frames.length]), 2500);
      };
      const run = () => { clearInterval(walk); if (!reduced) walk = setInterval(() => go((cur + 1) % steps.length), 6500); };
      const seen = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) { seen.disconnect(); go(0); run(); }
      }, { threshold: .2 });
      seen.observe(steps[0].closest('section'));
      steps.forEach((s, i) => s.addEventListener('click', () => { seen.disconnect(); go(i); run(); }));
    }

    // Underwriting you can defend: a cursor moves to a number and clicks it; the number's sources open. Three examples,
    // 7.5s each, once 30% of the mock is in view; a click on an example plays it and restarts the count.
    const trace = $('[data-trace]', homeRoot);
    if (trace) {
      const canvas = $('.h-mock-in', trace), cursor = $('[data-cursor]', trace);
      const scenes = $$('[data-scene]', trace), tabs = $$('[data-tab]', trace), pops = $$('[data-pop]', trace), picks = $$('[data-pick]', trace);
      const TAB = [3, 0, 1], DUR = 7500;   // the tab each example lights: Pro Forma, Rent Roll Analyzer, T-12 Analyzer
      let at = 0, from = null, loop = 0, waits = [];
      const set = i => {
        at = i;
        scenes.forEach((s, j) => { turn(s, j === i); const t = $('[data-target]', s); if (t) t.classList.remove('is-hit'); });
        tabs.forEach((t, j) => turn(t, j === TAB[i]));
        pops.forEach(p => { p.getAnimations().forEach(x => x.cancel()); p.classList.remove('is-open'); });
        picks.forEach((p, j) => {
          turn(p, j === i);
          p.setAttribute('aria-pressed', String(j === i));
          const bar = $('[data-pick-bar]', p);
          bar.getAnimations().forEach(x => x.cancel());
          bar.style.transform = j === i && reduced ? 'scaleX(1)' : 'scaleX(0)';
        });
        if (!reduced) $('[data-pick-bar]', picks[i]).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
          { duration: DUR, easing: 'linear', fill: 'forwards' });
      };
      const open = (i, anim) => {
        const t = $('[data-target]', scenes[i]);
        if (t) t.classList.add('is-hit');
        const p = pops[i];
        p.classList.add('is-open');
        if (!anim) return;
        p.animate([{ opacity: 0, transform: 'translateY(10px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: hEase });
        $$('[data-pop-row]', p).forEach((r, k) => r.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, delay: 300 + k * 280, easing: hEase, fill: 'backwards' }));
      };
      const play = i => {
        waits.forEach(clearTimeout);
        waits = [];
        set(i);
        if (reduced) { open(i, false); return; }
        const box = canvas.getBoundingClientRect(), s = box.width / 760 || 1;
        const r = $('[data-target] [data-value]', scenes[i]).getBoundingClientRect();
        const x = (r.left - box.left) / s + r.width / s * .6, y = (r.top - box.top) / s + r.height / s * .7;
        const f = from || { x: x + 200, y: y + 220 };
        cursor.getAnimations().forEach(z => z.cancel());
        cursor.animate([{ opacity: from ? 1 : 0, transform: 'translate(' + f.x + 'px,' + f.y + 'px)' },
          { opacity: 1, transform: 'translate(' + x + 'px,' + y + 'px)' }],
          { duration: 1000, delay: 500, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
        from = { x, y };
        waits.push(setTimeout(() => {
          const pos = 'translate(' + x + 'px,' + y + 'px)';
          cursor.animate([{ transform: pos + ' scale(1)' }, { transform: pos + ' scale(.82)' }, { transform: pos + ' scale(1)' }], { duration: 260 });
          open(i, true);
        }, 1600));
      };
      const cycle = () => { clearInterval(loop); loop = setInterval(() => play((at + 1) % scenes.length), DUR); };
      set(0);
      open(0, false);
      let seen = null;
      if (!reduced) {
        seen = new IntersectionObserver(es => {
          if (es.some(e => e.isIntersecting)) { seen.disconnect(); play(0); cycle(); }
        }, { threshold: .3 });
        seen.observe(trace);
      }
      picks.forEach((p, i) => p.addEventListener('click', () => { if (seen) seen.disconnect(); play(i); if (!reduced) cycle(); }));
    }
  }

  if (reduced) return;   // Everything below is motion.

  // Hero entrance.
  const img = $('[data-hero-img]');
  if (img) {
    const a = img.animate([
      { transform: 'scale(1.16)', opacity: 0, filter: 'blur(10px) brightness(.6)' },
      { transform: 'scale(1)', opacity: 1, filter: 'blur(0px) brightness(1)' }
    ], { duration: 2400, easing: ease, fill: 'backwards' });
    a.onfinish = () => img.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }],
      { duration: 18000, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
  }
  const sweep = $('[data-sweep]');
  if (sweep) sweep.animate([
    { transform: 'translateX(-120%)' }, { transform: 'translateX(120%)', offset: .28 }, { transform: 'translateX(120%)' }
  ], { duration: 9000, delay: 1200, iterations: Infinity, easing: 'ease-in-out' });
  const page = $('[data-hero-page]');
  if (page) page.animate([
    { transform: 'perspective(1600px) rotateY(28deg) rotateX(10deg) translateY(70px)', opacity: 0 },
    { transform: 'perspective(1600px) rotateY(10deg) rotateX(3deg)', opacity: 1 }
  ], { duration: 1500, delay: 400, easing: ease, fill: 'backwards' });
  const chip = $('[data-hero-chip]');
  if (chip) chip.animate([{ opacity: 0, transform: 'translateY(16px) scale(.96)' }, { opacity: 1, transform: 'none' }],
    { duration: 900, delay: 1500, easing: ease, fill: 'backwards' });

  // Hero parallax: the pointer over the stage as -.5…+.5 on each axis; the layers' CSS turns it into pixels.
  const stage = $('[data-stage]');
  if (stage) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      stage.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--px', '0');
      stage.style.setProperty('--py', '0');
    });
  }

  // Scroll reveals: [data-rise="delayMs"] fades in and rises the first time 12% of it is in view: 24px over 900ms, or on
  // Home 26px over 1100ms on the home easing, leaving alone what is already scrolled past. Printing shows them all.
  const isHome = !!$('.h-open');
  const riseBy = isHome ? 26 : 24, riseMs = isHome ? 1100 : 900, riseEase = isHome ? 'cubic-bezier(.22,.61,.24,1)' : ease;
  const rise = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    rise.unobserve(en.target);
    const el = en.target;
    el.style.opacity = '';
    el.animate([{ opacity: 0, transform: 'translateY(' + riseBy + 'px)' }, { opacity: 1, transform: 'none' }],
      { duration: riseMs, delay: +(el.dataset.rise || 0), easing: riseEase, fill: 'backwards' });
  }), { threshold: .12 });
  $$('[data-rise]').forEach(el => {
    if (isHome && el.getBoundingClientRect().bottom < 0) return;
    el.style.opacity = '0';
    rise.observe(el);
  });
  window.addEventListener('beforeprint', () => $$('[data-rise]').forEach(el => { el.style.opacity = ''; }));

  // The value bridge plays once when 35% of the card is visible; Replay is shown only where motion runs.
  const bridge = $('[data-bridge]');
  if (bridge) {
    const once = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { once.disconnect(); playBridge(); }
    }), { threshold: .35 });
    once.observe(bridge);
    const replay = $('[data-replay]');
    if (replay) { replay.hidden = false; replay.addEventListener('click', playBridge); }
  }

  // The record: the stack untilts from rotateX(22deg) translateY(50px), flat once its top is 75% of a viewport up.
  const tilts = $$('[data-tilt]');
  if (tilts.length) {
    const tilt = () => {
      const vh = window.innerHeight;
      tilts.forEach(el => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .75)));
        el.style.transform = 'perspective(1400px) rotateX(' + ((1 - p) * 22).toFixed(2) + 'deg) translateY(' + ((1 - p) * 50).toFixed(1) + 'px)';
      });
    };
    window.addEventListener('scroll', tilt, { passive: true });
    window.addEventListener('resize', tilt);
    tilt();
  }
})();
