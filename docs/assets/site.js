const CONFIG = {
  CTA_LABEL: 'Try it free',     // README "Open items": parked wording — one string, printed everywhere it appears
  SIGN_IN_URL: 'https://app.civiumcre.com/',   // the app's sign-in; '' = the sign-in link is not rendered
  SIGN_IN_LABEL: 'Client portal',              // the sign-in link's words — one string
  PROSPECT_DOOR_URL: 'https://app.civiumcre.com/api/prospect',   // the app's prospect door (§4), no trailing slash; '' = the modal is not offered (the off state below)
  TRIAL_ON: true,               // README "Open items": '' false = Privacy item 2 and the modal's steps 2–3 are not rendered
  PREVIEW_DAYS: 7, TRIAL_DAYS: 15,   // the README's numbers, printed where the copy prints them
  HERO_IMAGE: ''                // Caden's photo or render; '' = the dark fill
};

// civiumcre.com — the site's one script. Above: Caden's switches. Below: the copy they print, the trial switch,
// the sign-in link, Try it free (the modal and the door, or the mailto: off state), the sample page, the grain, the
// receipt cards, the pricing toggle and the motion of design_handoff_site/README.md ("Interactions and motion"); with
// prefers-reduced-motion set, no motion runs and the final state shows.
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

  // Try it free. Off (PROSPECT_DOOR_URL empty): the HTML's mailto: links stay, same label and look, and the modal is
  // removed. On: Home's controls open the modal; Pricing, FAQ and 404 link to /#try, which opens it on Home.
  const flow = $('[data-flow]');
  if (!CONFIG.PROSPECT_DOOR_URL) {
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

  // Pricing: the billing toggle (two buttons with aria-pressed); Yearly is the default.
  const billing = $$('[data-billing]');
  billing.forEach(b => b.addEventListener('click', () => {
    const mode = b.dataset.billing;
    billing.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    $$('[data-yearly]').forEach(el => { el.textContent = el.dataset[mode]; });
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

  // Scroll reveals: [data-rise="delayMs"] fades in and rises 24px over 900ms the first time 12% of it is in view.
  const rise = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    rise.unobserve(en.target);
    const el = en.target;
    el.style.opacity = '';
    el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: +(el.dataset.rise || 0), easing: ease, fill: 'backwards' });
  }), { threshold: .12 });
  $$('[data-rise]').forEach(el => { el.style.opacity = '0'; rise.observe(el); });

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
