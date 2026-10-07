const CONFIG = {
  CTA_LABEL: 'Try it free',     // README "Open items": parked wording — one string, printed everywhere it appears
  SIGN_IN_URL: '',              // the app's sign-in (https://app.civiumcre.com); '' = the Sign in link is not rendered
  PROSPECT_DOOR_URL: '',        // the app's prospect door (§4); '' = the modal is not offered (the off state below)
  TRIAL_ON: true,               // README "Open items": '' false = Privacy item 2 and the modal's steps 2–3 are not rendered
  PREVIEW_DAYS: 7, TRIAL_DAYS: 15,   // the README's numbers, printed where the copy prints them
  HERO_IMAGE: ''                // Caden's photo or render; '' = the dark fill
};

// civiumcre.com — the site's one script. Above: Caden's switches. Below: the copy they print, the sample page,
// the grain, the receipt cards, the pricing toggle and the motion of design_handoff_site/README.md
// ("Interactions and motion"); with prefers-reduced-motion set, no motion runs and the final state shows.
(() => {
  'use strict';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.2,.7,.2,1)';

  // The copy the configuration prints.
  $$('[data-cta]').forEach(el => { el.textContent = CONFIG.CTA_LABEL; });
  $$('[data-preview-days]').forEach(el => { el.textContent = String(CONFIG.PREVIEW_DAYS); });
  $$('[data-trial-days]').forEach(el => { el.textContent = String(CONFIG.TRIAL_DAYS); });

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
