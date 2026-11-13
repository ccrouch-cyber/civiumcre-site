'use strict';
// Captures the client-app screenshots the homepage shows, from the prototype in ../prototype, into docs/assets/app/.
//
//   cd design_handoff_homepage/capture
//   npm install && npx playwright install chromium
//   node capture-app-shots.cjs ../../docs/assets/app
//
// It serves ../prototype on a local port, opens each screen in Chromium at 1280px wide (the width the design renders
// every app screen at before scaling it down), and writes two JPEGs per screen: <name>-1280.jpg at 1x and
// <name>-2560.jpg at 2x. The prototype loads React, Leaflet and map tiles from the internet, so this needs a network.
// Open every image afterwards and compare it with the same frame in the prototype homepage (README, "Check").
//
// Node 18 or later. The guard at the bottom keeps the file inert anywhere else.

// h: the screen's height in 1280px units, which is the box's aspect at 1280 wide:
//   the opening's two screens 2048 (the box's height varies with the page; phones see the most of it),
//   the walkthrough 960 (4:3), the plan 880 (16:11).
// scrollTo: the screen scrolls so the first element holding this text sits `offset` px below the top.
// settle: extra wait in ms after the network is idle (the market map's tiles).
const SHOTS = [
  { name: 'app-home', q: 'screen=home', h: 2048 },
  { name: 'app-deal', q: 'deal=larkspur', h: 2048 },
  { name: 'walk-upload', q: 'new=1', h: 960 },
  { name: 'walk-rent-roll', q: 'deal=larkspur&tab=rent-roll', h: 960 },
  { name: 'walk-t12', q: 'deal=larkspur&tab=t12', h: 960 },
  { name: 'walk-market', q: 'deal=larkspur&tab=market', h: 960, settle: 6000 },
  { name: 'walk-pro-forma', q: 'deal=larkspur', h: 960 },
  { name: 'plan-optimization', q: 'deal=larkspur&view=optimization', h: 880, scrollTo: 'Potential valuation range', offset: 188 }
];

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };

// The same scroll the prototype homepage did inside its frame: the nearest scrolling ancestor, else the window.
// Runs in the page (handed to page.evaluate).
function scrollToText({ text, offset }) {
  const find = root => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (n.nodeValue.includes(text)) return n.parentElement; }
      else if (n.shadowRoot) { const r = find(n.shadowRoot); if (r) return r; }
    }
    return null;
  };
  const el = find(document.body);
  if (!el) return false;
  let p = el.parentElement, sc = null;
  while (p && p !== document.body) {
    const cs = getComputedStyle(p);
    if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) { sc = p; break; }
    p = p.parentElement;
  }
  const r = el.getBoundingClientRect();
  if (sc) sc.scrollTop += r.top - sc.getBoundingClientRect().top - offset;
  else window.scrollTo(0, r.top + window.scrollY - offset);
  return true;
}

async function main() {
  const need = name => module.require(name);   // Node's own loader, at run time
  const { chromium } = need('playwright');
  const http = need('http');
  const { readFile, mkdir } = need('fs/promises');
  const path = need('path');

  const ROOT = path.resolve(__dirname, '../prototype');
  const OUT = path.resolve(process.cwd(), process.argv[2] || '../../docs/assets/app');
  const APP = 'templates/client-app/ClientApp.dc.html?theme=coastal&';

  const server = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(body);
    } catch (e) { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/';

  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const s of SHOTS) {
      for (const dsf of [1, 2]) {
        const context = await browser.newContext({
          viewport: { width: 1280, height: s.h }, deviceScaleFactor: dsf,
          reducedMotion: 'reduce', timezoneId: 'America/Chicago', locale: 'en-US', colorScheme: 'light'
        });
        // A fixed morning, so the home screen reads "Good morning" and today's date the same on every run.
        // If a screen comes out blank, delete this line and run again.
        await context.clock.setFixedTime(new Date('2026-11-12T10:00:00-06:00'));
        const page = await context.newPage();
        await page.goto(base + APP + s.q, { waitUntil: 'networkidle', timeout: 90000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(s.settle || 2500);
        if (s.scrollTo) {
          const ok = await page.evaluate(scrollToText, { text: s.scrollTo, offset: s.offset });
          if (!ok) throw new Error(s.name + ': no element holds "' + s.scrollTo + '"');
          await page.waitForTimeout(800);
        }
        const file = path.join(OUT, s.name + '-' + (dsf === 1 ? 1280 : 2560) + '.jpg');
        await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
        console.log('wrote', path.relative(process.cwd(), file));
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

const runByNode = typeof process === 'object' && !!(process.versions && process.versions.node)
  && typeof module === 'object' && typeof require === 'function' && require.main === module;
if (runByNode) main().catch(err => { console.error(err); process.exitCode = 1; });
