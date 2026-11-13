const CONFIG = {
  CTA_LABEL: 'Create account',  // the design's words (design_handoff_onboarding) — one string, printed everywhere it appears
  SIGNUP_URL: 'https://app.civiumcre.com/signup',   // where Create account goes (the app's sign-up); '' = the Try it free modal below
  SIGN_IN_URL: 'https://app.civiumcre.com/',   // the app's sign-in; '' = the sign-in link is not rendered
  SIGN_IN_LABEL: 'Client portal',              // the sign-in link's words — one string
  PROSPECT_DOOR_URL: 'https://app.civiumcre.com/api/prospect',   // the app's prospect door (§4), no trailing slash; '' = the modal is not offered (the off state below)
  TRIAL_ON: false,              // README "Open items": '' false = Privacy item 2 and the modal's steps 2–3 are not rendered
  PREVIEW_DAYS: 7, TRIAL_DAYS: 15,   // the README's numbers, printed where the copy prints them
  PAY_LINK_DEAL: '',            // Stripe's Payment Link for one deal; '' = the button emails Caden
  PAY_LINK_MONTHLY: '',         // Stripe's Payment Link for the monthly plan; '' = the button emails Caden
  PAY_LINK_YEARLY: '',          // Stripe's Payment Link for the yearly plan; '' = the button emails Caden
  HERO_IMAGE: ''                // Caden's photo or render; '' = the dark fill
};

// civiumcre.com — the site's one script. Above: Caden's switches. Below: the copy they print, the trial switch,
// the sign-in link (the header's, and Home's footer), Try it free (the modal and the door, or the mailto: off state), the sample page, the grain, the
// receipt cards, the pricing toggle and the motion of design_handoff_site/README.md ("Interactions and motion"); with
// prefers-reduced-motion set, no motion runs and the final state shows. Home's own parts (design_handoff_homepage) come
// last before the motion: the wordmark's way back to the top, the numbers, lines, walkthrough and trust mock.
(() => {
  'use strict';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.2,.7,.2,1)';

  // The copy the configuration prints.
  $$('[data-cta], [data-cta-label]').forEach(el => { el.textContent = CONFIG.CTA_LABEL; });
  $$('[data-preview-days]').forEach(el => { el.textContent = String(CONFIG.PREVIEW_DAYS); });
  $$('[data-trial-days]').forEach(el => { el.textContent = String(CONFIG.TRIAL_DAYS); });

  // The trial switch: with TRIAL_ON false, Privacy item 2, the modal's steps 2 and 3, and the "View-only for N days."
  // half of step 1's note are not rendered, so the note reads "No card needed."
  if (!CONFIG.TRIAL_ON) $$('[data-trial]').forEach(el => el.remove());

  // The sign-in link: SIGN_IN_LABEL, in the nav's link style before the primary button, when SIGN_IN_URL is set.
  if (CONFIG.SIGN_IN_URL) $$('.header .nav').forEach(nav => {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = CONFIG.SIGN_IN_URL;
    a.textContent = CONFIG.SIGN_IN_LABEL;
    nav.insertBefore(a, $('[data-cta]', nav));
  });
  // Home: the footer's sign-in link and the header's divider before it follow the same switch.
  $$('[data-sign-in]').forEach(a => {
    if (!CONFIG.SIGN_IN_URL) { a.remove(); return; }
    a.href = CONFIG.SIGN_IN_URL;
    a.textContent = CONFIG.SIGN_IN_LABEL;
    a.hidden = false;
  });
  if (!CONFIG.SIGN_IN_URL) $$('[data-sign-in-sep]').forEach(el => el.remove());

  // Try it free. Off (PROSPECT_DOOR_URL empty): the HTML's mailto: links stay, same label and look, and the modal is
  // removed. On: Home's controls open the modal; Pricing, FAQ and 404 link to /#try, which opens it on Home.
  // Create account (the onboarding, 10/31): with SIGNUP_URL set, every control and the plan button go to the app's sign-up.
  const flow = $('[data-flow]');
  if (CONFIG.SIGNUP_URL) {
    if (flow) flow.remove();
    $$('[data-cta]').forEach(a => { a.href = CONFIG.SIGNUP_URL; });
    $$('[data-pay="plan"]').forEach(a => { a.dataset.mail = CONFIG.SIGNUP_URL; });
  } else if (!CONFIG.PROSPECT_DOOR_URL) {
    if (flow) flow.remove();
  } else if (!flow) {
    $$('[data-cta]').forEach(a => { a.href = '/#try'; });
  } else {
    const site = $('[data-site]');
    const panel = $('[role="dialog"]', flow);
    const form = $('form', flow);
    const email = $('input[type="email"]', flow);
    const send = $('button[type="submit"]', flow);
    const refusal = $('[data-flow-refusal]', flow);
    const tiles = $$('[data-tile]', flow);
    const emptyText = $('.tile-file', tiles[0]).textContent;
    const files = {};
    let opener = null;
    let request = 0;     // bumped on every reset and send; a reply for an older number is ignored
    let inFlight = 0;

    // The door's numbers and words, mirrored from the product (civium_prospect.py, civium_drops.py); the door stays
    // the authority. A file whose name is not a workbook's, or files past these numbers, are refused here in the
    // door's own words and never sent: a body declared past the door's number meets a wall a page cannot read.
    const MIB = 1024 * 1024;
    const FILE_MAX = 40 * MIB;                 // civium_prospect.FILE_MAX (= civium_drops.SIZE_MAX): one file
    const BODY_MAX = 85 * MIB;                 // civium_prospect.BODY_MAX: the whole body
    const EXTS = ['.xlsx', '.xlsm', '.xls'];   // civium_drops.EXTS: a workbook, by the end of its name
    const WORDS = {                            // civium_prospect.WORDS, verbatim, at those numbers
      too_large: 'the files are too large — the form takes up to 40 MB a file',
      not_a_workbook: 'send the rent roll as a workbook (.xlsx, .xlsm or .xls)',
      not_a_statement: 'send the T-12 as a workbook (.xlsx, .xlsm or .xls)'
    };
    const NOT_ITS_KIND = { rent_roll: 'not_a_workbook', t12: 'not_a_statement' };   // civium_prospect.NOT_ITS_KIND
    // The site's one sentence of its own, for an answer with no words the page can read.
    const NO_WORDS = 'Civium could not take the files just now — try again in a few minutes.';

    const show = n => {
      $$('[data-step]', flow).forEach(step => { step.hidden = step.dataset.step !== String(n); });
      const title = $('[data-step="' + n + '"] .flow-title', flow);
      panel.setAttribute('aria-labelledby', title.id);
      title.focus();
    };
    const setFile = (key, file) => {
      files[key] = file || null;
      const tile = tiles.find(t => t.dataset.tile === key);
      tile.classList.toggle('is-on', !!file);
      $('.tile-file', tile).textContent = file ? file.name + ' attached' : emptyText;
    };
    const say = words => { refusal.textContent = words; refusal.hidden = !words; };   // the line under the button
    const reset = () => {   // "Closing the modal resets the attached files."
      request++;
      inFlight = 0;
      send.removeAttribute('aria-disabled');
      tiles.forEach(t => setFile(t.dataset.tile, null));
      $$('input', flow).forEach(i => { i.value = ''; });
      say('');
    };
    const openFlow = from => {
      opener = from || null;
      reset();
      flow.hidden = false;
      site.inert = true;
      show(1);
    };
    const closeFlow = () => {
      if (flow.hidden) return;
      flow.hidden = true;
      site.inert = false;
      reset();
      if (opener && opener.isConnected) opener.focus();
      opener = null;
    };

    // The controls become buttons that open the modal.
    $$('[data-cta]').forEach(a => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = a.className;
      b.dataset.cta = '';
      b.textContent = a.textContent;
      b.setAttribute('aria-haspopup', 'dialog');
      b.addEventListener('click', () => openFlow(b));
      a.replaceWith(b);
    });

    // Close: the Close and Done buttons, Escape, and a click outside the panel. Tab and Shift+Tab cycle inside it.
    $$('[data-flow-close]', flow).forEach(b => b.addEventListener('click', closeFlow));
    let downOutside = false;
    flow.addEventListener('mousedown', e => { downOutside = e.target === flow; });
    flow.addEventListener('click', e => { if (e.target === flow && downOutside) closeFlow(); });
    document.addEventListener('keydown', e => {
      if (flow.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeFlow(); return; }
      if (e.key !== 'Tab') return;
      const stops = $$('button, [href], input, select, textarea', panel).filter(el => !el.disabled && el.getClientRects().length);
      if (!stops.length) return;
      e.preventDefault();
      const at = document.activeElement, n = stops.length, i = stops.indexOf(at);
      let to;
      if (i !== -1) to = stops[(i + (e.shiftKey ? n - 1 : 1)) % n];
      else if (!panel.contains(at)) to = e.shiftKey ? stops[n - 1] : stops[0];
      else {   // on a step title: the next stop after it, or the one before it, wrapping
        const ahead = stops.filter(s => at.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING);
        const behind = stops.filter(s => at.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_PRECEDING);
        to = e.shiftKey ? (behind.length ? behind[behind.length - 1] : stops[n - 1]) : (ahead.length ? ahead[0] : stops[0]);
      }
      to.focus();
    });

    // The upload tiles: choose a file or drop one; a drop anywhere else on the overlay does nothing. A file whose name
    // does not end in one of EXTS is not attached: the door's words for its part show under the button.
    tiles.forEach(tile => {
      const key = tile.dataset.tile;
      const input = $('input[data-file="' + key + '"]', flow);
      const choose = file => {
        const ok = !file || EXTS.some(x => file.name.toLowerCase().endsWith(x));
        setFile(key, ok ? file : null);
        say(ok ? '' : WORDS[NOT_ITS_KIND[key]]);
        if (!ok) input.value = '';   // so the same file chosen again is judged again
      };
      tile.addEventListener('click', () => input.click());
      input.addEventListener('change', () => choose(input.files[0]));
      tile.addEventListener('drop', e => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) choose(f); });
    });
    flow.addEventListener('dragover', e => e.preventDefault());
    flow.addEventListener('drop', e => e.preventDefault());

    // Step 1 sends to the prospect door: multipart email, rent_roll, t12; no cookie. Files past the door's numbers are
    // not sent; its too_large words show instead. Accepted (202): step 2 (or, with the trial off, the modal closes).
    // Any other answer: the door's own words when it carries them (4xx or 5xx), else NO_WORDS. The button works again.
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (inFlight) return;
      const chosen = [files.rent_roll, files.t12].filter(Boolean);
      if (chosen.some(f => f.size > FILE_MAX) || chosen.reduce((sum, f) => sum + f.size, 0) > BODY_MAX) {
        say(WORDS.too_large);
        return;
      }
      const mine = ++request;
      inFlight = mine;
      send.setAttribute('aria-disabled', 'true');
      say('');
      const body = new FormData();
      body.append('email', email.value.trim());
      if (files.rent_roll) body.append('rent_roll', files.rent_roll);
      if (files.t12) body.append('t12', files.t12);
      let accepted = false, words = '';
      try {
        // The door's three traps: a header set by hand, or an upload-progress listener, makes the browser preflight
        // the post, and the door answers a preflight with a 405; credentials: 'include' hides the door's 202. So this
        // post sends the form data alone and omits credentials; tools/check_site.sh holds all three.
        const res = await fetch(CONFIG.PROSPECT_DOOR_URL, { method: 'POST', body, mode: 'cors', credentials: 'omit' });
        accepted = res.status === 202;
        if (res.status >= 400 && res.status < 600) {
          const data = await res.json().catch(() => null);
          const said = data && data.detail && data.detail.rejected;
          if (typeof said === 'string' && said.trim()) words = said;
        }
      } catch (err) {
        // No answer the page can read: a blocked one (the wall's 413 carries no allow header) or a failed network.
      }
      if (mine !== request) return;   // closed or reset while the door answered
      inFlight = 0;
      send.removeAttribute('aria-disabled');
      if (accepted) { if (CONFIG.TRIAL_ON) show(2); else closeFlow(); return; }
      say(words || NO_WORDS);   // never a status number, a URL or a stack
    });

    if (location.hash === '#try') {   // from Pricing, FAQ or 404: drop the fragment so it cannot pull focus back out
      history.replaceState(null, '', location.pathname + location.search);
      openFlow($('.header [data-cta]'));
    }
  }

  // The sample page: one <template>, cloned into each slot (the hero stage and The record).
  const sample = $('#sample-page');
  if (sample) $$('[data-sample-slot]').forEach(slot => slot.appendChild(sample.content.cloneNode(true)));

  // The hero image: Caden's file when configured; until then the dark fill shows.
  const photo = $('[data-hero-photo]');
  if (photo && CONFIG.HERO_IMAGE) photo.src = CONFIG.HERO_IMAGE;

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

  // Pricing: the billing toggle (two buttons with aria-pressed); Yearly is the default. The plan buttons
  // ([data-pay]) open Stripe's Payment Links from CONFIG when those are set — the yearly or the monthly link follows
  // the toggle, the deal link stands alone; an empty link leaves the button the mailto: it was written with.
  const billing = $$('[data-billing]');
  const payButtons = $$('[data-pay]');
  const setPay = mode => payButtons.forEach(a => {
    a.dataset.mail = a.dataset.mail || a.getAttribute('href');
    const link = a.dataset.pay === 'deal' ? CONFIG.PAY_LINK_DEAL
      : (mode === 'yearly' ? CONFIG.PAY_LINK_YEARLY : CONFIG.PAY_LINK_MONTHLY);
    if (link) { a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else { a.href = a.dataset.mail; a.removeAttribute('target'); a.removeAttribute('rel'); }
  });
  setPay('yearly');
  billing.forEach(b => b.addEventListener('click', () => {
    const mode = b.dataset.billing;
    billing.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    $$('[data-yearly]').forEach(el => { el.textContent = el.dataset[mode]; });
    setPay(mode);
  }));

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
      minutes: v => String(Math.round(v)),
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
