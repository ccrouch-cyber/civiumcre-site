'use strict';
// tools/capture_start.cjs: makes the Get started window's pictures from the sign-up design, into docs/assets/start/.
//
//   NODE_PATH=<a folder holding playwright>/node_modules node tools/capture_start.cjs <design folder> [docs/assets/start]
//
// <design folder> is the sign-up handoff's design/ folder (templates/client-app and templates/site-home inside it).
// It is never committed here; this tool only photographs it. Playwright is the homepage capture tool's own install
// (design_handoff_homepage/capture: npm install && npx playwright install chromium). The design loads its runtime
// from the internet, so this needs a network.
//
// It writes:
//   demo-1280.webp, free-1280.webp, trial-1280.webp and their -1920 twins: the three app previews. Each is the
//     design's sample app at 1280x800, the screen the design frames in that panel (the addresses below are the
//     design's own), shown in the window at 704x440. A screen with twice the pixels picks the -1920 file.
//   grain-240.webp, grain-480.webp: the design's grain texture, one 240px tile, as Chromium draws it on a screen
//     with one pixel per point and on one with two.
//   mottle-a.webp ... mottle-d.webp: the design's four mottle textures, each drawn at 1200x800 and saved at 480x320.
// The textures are the design's own SVG noise, drawn once here and saved as pictures: every browser then shows the
// same texture, and none has to redraw the noise on every frame while a panel widens.
//
// Node 18 or later. The guard at the bottom keeps the file inert anywhere else.

// d, q: the screen the design frames in a panel, and where the design's window stops short of it.
const SHOTS = [
  { name: 'demo', q: 'deal=larkspur&theme=coastal&plan=demo' },
  { name: 'free', q: 'new=1&theme=coastal' },
  { name: 'trial', q: 'screen=home&theme=coastal' }
];
const MOTTLES = ['a', 'b', 'c', 'd'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };

// Runs in the page: draws a PNG (base64) on a canvas at w x h and returns it as WebP (base64). With `steps` set the
// picture is a texture: its colour is dropped and its opacity rounded to that many steps, saved without loss.
// Without it the picture is a screenshot, saved at `quality`.
function toWebp({ png, w, h, steps, quality }) {
  return new Promise((resolve, reject) => {
    const im = document.createElement('img');
    im.src = 'data:image/png;base64,' + png;
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = w || im.naturalWidth;
      c.height = h || im.naturalHeight;
      const x = c.getContext('2d');
      x.drawImage(im, 0, 0, c.width, c.height);
      if (steps) {
        const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
        for (let i = 0; i < p.length; i += 4) {
          p[i] = p[i + 1] = p[i + 2] = 0;
          p[i + 3] = Math.round(Math.round(p[i + 3] / 255 * (steps - 1)) / (steps - 1) * 255);
        }
        x.putImageData(d, 0, 0);
      }
      resolve(c.toDataURL('image/webp', steps ? 1 : quality).split(',')[1]);
    };
    im.onerror = () => reject(new Error('the PNG did not decode'));
  });
}

async function main() {
  const need = name => module.require(name);   // Node's own loader, at run time
  const { chromium } = need('playwright');
  const http = need('http');
  const { readFile, writeFile, mkdir } = need('fs/promises');
  const path = need('path');

  const ROOT = path.resolve(process.cwd(), process.argv[2]);
  const OUT = path.resolve(process.cwd(), process.argv[3] || 'docs/assets/start');
  const APP = 'templates/client-app/ClientApp.dc.html?theme=coastal&';
  const TEX = 'templates/site-home/textures/';

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
    // The three app previews.
    for (const s of SHOTS) {
      for (const dsf of [1, 2]) {
        const context = await browser.newContext({
          viewport: { width: 1280, height: 800 }, deviceScaleFactor: dsf,
          reducedMotion: 'reduce', timezoneId: 'America/Chicago', locale: 'en-US', colorScheme: 'light'
        });
        // The homepage capture tool's fixed morning, so every picture of the sample app shows the same day.
        await context.clock.setFixedTime(new Date('2026-11-12T10:00:00-06:00'));
        const page = await context.newPage();
        await page.goto(base + APP + s.q, { waitUntil: 'networkidle', timeout: 90000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2500);
        const png = (await page.screenshot({ type: 'png' })).toString('base64');
        // The 2x capture is saved at 1920 wide: enough for the 704pt window on a screen with twice the pixels.
        const wh = dsf === 2 ? { w: 1920, h: 1200 } : {};
        const file = path.join(OUT, s.name + '-' + (dsf === 1 ? 1280 : 1920) + '.webp');
        await writeFile(file, Buffer.from(await page.evaluate(toWebp, { png, quality: .82, ...wh }), 'base64'));
        console.log('wrote', path.relative(process.cwd(), file));
        await context.close();
      }
    }

    // The textures: each drawn on a clear page at its own size, photographed with a clear ground. Sixteen steps of
    // opacity is indistinguishable from the SVG up close (checked at one and two pixels per point).
    const texture = async (css, w, h, dsf, outW, outH) => {
      const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, colorScheme: 'light' });
      const page = await context.newPage();
      await page.goto(base + TEX, { waitUntil: 'load' }).catch(() => {});   // a folder listing, or a 404: only the address matters
      await page.setContent('<!doctype html><meta charset="utf-8"><div id="t"></div>', { waitUntil: 'load' });
      await page.evaluate(({ css, w, h }) => {
        document.documentElement.style.background = 'transparent';
        document.body.style.cssText = 'margin:0;background:transparent';
        document.getElementById('t').style.cssText = 'width:' + w + 'px;height:' + h + 'px;background:' + css;
      }, { css, w, h });
      await page.waitForTimeout(700);
      const png = (await page.locator('#t').screenshot({ type: 'png', omitBackground: true })).toString('base64');
      const webp = await page.evaluate(toWebp, { png, w: outW, h: outH, steps: 16 });
      await context.close();
      return Buffer.from(webp, 'base64');
    };
    const save = async (name, bytes) => {
      const file = path.join(OUT, name);
      await writeFile(file, bytes);
      console.log('wrote', path.relative(process.cwd(), file));
    };
    for (const dsf of [1, 2]) await save('grain-' + 240 * dsf + '.webp', await texture('url(grain.svg)', 240, 240, dsf));
    for (const m of MOTTLES) {
      await save('mottle-' + m + '.webp', await texture('url(mottle-' + m + '.svg) center / cover no-repeat', 1200, 800, 1, 480, 320));
    }
  } finally {
    await browser.close();
    server.close();
  }
}

const runByNode = typeof process === 'object' && !!(process.versions && process.versions.node)
  && typeof module === 'object' && typeof require === 'function' && require.main === module;
if (runByNode) main().catch(err => { console.error(err); process.exitCode = 1; });
