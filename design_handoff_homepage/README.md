# Handoff: civiumcre.com in coastal (Home, Pricing, FAQ, 404)

## Start here (for Claude Code)
- **Target:** `ccrouch-cyber/civiumcre-site`, branch `main`. GitHub Pages publishes `docs/`. This replaces all four pages with the coastal look: Home (`docs/index.html`), Pricing (`docs/pricing/index.html`), FAQ (`docs/faq/index.html`) and 404 (`docs/404.html`).
- **The build is already written.** `site/` mirrors the repo root and holds the finished files: the four pages, a new `docs/assets/coastal.css` (the coastal site's styles), `docs/assets/site.css` and `docs/assets/site.js` with the additions merged in, the fonts, the photos, the live-numbers file, its workflow and its script. Your job is to put them in, capture the app screenshots, keep `tools/check_site.sh` green, and check the result against the design.
- **Put this folder in the repo root** as `design_handoff_homepage/`. Its `.gitignore` keeps `prototype/`, `preview/` and the capture tool's install out of git. **Never commit `prototype/`.** It holds the client app's prototype (its sample data and its valuation math), and this repo is public-facing.
- **The design** is in `prototype/templates/site-home/`: `HomeV4.dc.html` (Home), `SitePricing.dc.html` (Pricing) and `SiteFaq.dc.html` (FAQ). Serve `prototype/` over HTTP (`npx serve design_handoff_homepage/prototype`) and open those paths. They won't run from `file://`. 404 has no design file: it's the FAQ page's header, title and footer around "Not found".

## Steps
1. **Read the design.** Open the three prototype pages at 1440 wide and at 390 wide. The homepage's app frames are live copies of the client-app prototype; the site shows screenshots of the same screens instead (the site may not load anything from another host, and the app at app.civiumcre.com is private).
2. **Copy `site/` over the repo.** The `site.css` and `site.js` here were taken from `main` on 2026-11-12. Diff them against the repo first. If either changed on `main` since, merge the additions (listed under "What changed in site.css and site.js") instead of overwriting.
   - Replaced: `docs/index.html`, `docs/pricing/index.html`, `docs/faq/index.html`, `docs/404.html`, `docs/assets/site.css`, `docs/assets/site.js`
   - New: `docs/assets/coastal.css`, `docs/assets/stats.js`, `docs/assets/fonts/` (4 files), `docs/assets/photos/` (6 files), `tools/write_stats.cjs`, `.github/workflows/stats.yml`, `licenses/`
   - Unchanged, and must stay byte-for-byte: `docs/assets/tokens.css`, `docs/assets/system.css`
3. **Capture the app screenshots** into `docs/assets/app/` (16 files):
   ```
   cd design_handoff_homepage/capture
   npm install && npx playwright install chromium
   node capture-app-shots.cjs ../../docs/assets/app
   ```
   Open every image and compare it with the same frame in the prototype homepage (see "App screenshots").
4. **Run `bash tools/check_site.sh`.** It must say `check_site: green`. Before step 3 it fails on the missing `/assets/app/` files; that's expected.
5. **Check the build against the design.** Serve `docs/` (`npx serve docs`) beside the prototype and go through "Check" below at 1440, 1024, 768 and 390 wide, with motion on and with reduced motion.
6. **Commit** `docs/`, `tools/write_stats.cjs`, `.github/workflows/stats.yml`, `licenses/` and this folder's README, `capture/` script and `site/` copies. Don't commit `prototype/`, `preview/` or `capture/node_modules/`.
7. **Wire the live numbers** (see "Live numbers"). Until that's done the proof band reads "Not yet measured", which is the intended state.

## How this build keeps `tools/check_site.sh` green
- **No color literal outside site.css's token block.** Every color, shadow and font stack the four pages use is a `--coastal-*` token added inside the existing `tokens:begin … tokens:end` block. `coastal.css`, the pages and `site.js` only use `var(--coastal-…)`, and the pages have no `style` attributes. No hex, `rgba()`, `color-mix()` or named color appears anywhere else, and site.js sets classes, never colors. The SVG icons and the cursor take their colors from CSS (`currentColor`, or classes).
- **Every href and src resolves under `docs/`.** Fonts and photos are local. There's no Google Fonts link and no image host. `data-src` values count too, so the held-back walkthrough screens must exist. Create account keeps the site's pattern (`href="mailto:…" data-cta`) and site.js points it at `SIGNUP_URL`. Client portal in the footer is `href="/" data-sign-in hidden`, and site.js points it at `SIGN_IN_URL`.
- **The Privacy Policy link is left out** because `/privacy/` doesn't exist yet and a dead link fails check 2. The snippet to add is under Open items.
- **One `<h1>` per page.** Pricing keeps exactly one `data-pay="deal"` (Per deal) and one `data-pay="plan"` (Individual), which check 6b counts. **No outside host** in any text file under `docs/`: the font licenses live in `licenses/`, outside `docs/`, because they contain URLs. **site.js still makes exactly one `fetch(`,** the door's. The live numbers arrive as a script file, not a fetch.
- **The configuration block is untouched.** `CTA_LABEL` ("Create account"), `SIGNUP_URL`, `SIGN_IN_URL`/`SIGN_IN_LABEL` and `HERO_IMAGE` drive the homepage as they drive the other pages. The Try it free modal markup is kept at the bottom of `index.html` because `/#try` and the door's off state depend on it. With `SIGNUP_URL` set, site.js removes it.

## Fidelity
**High-fidelity.** Copy, colors, type, spacing, photos and motion are final, and the files in `site/` already match the prototype. Don't restyle anything. Where the build differs from the prototype, it's on purpose:
- App frames are screenshots, not live iframes.
- The step list and the example picker are `<button>`s so they work from the keyboard.
- The photo-card fade runs on `:hover` only on devices that can hover.
- The walkthrough starts when it scrolls into view. The prototype also started it after 4s, which was there for the design tool.
- On Home, the wordmark scrolls back to the top instead of reloading the page. The prototype reloads it, which also lands at the top.
- Nothing else differs.

How to read a `.dc.html` file:
- Styles are inline. `style-hover` is the `:hover` rule.
- `{{ name }}` holes are filled by the `class Component` block at the bottom, which holds every timing.
- `support.js`, `ds-base.js`, `image-slot.js` and `_ds_bundle.js` are the prototype's runtime. Don't port them.

## Home
All sizes are fluid against `.site`, which is `container-type: inline-size`, so `cqw` is a percent of the page width. Content is max 1312px wide (1440px in the opening) with side padding `clamp(20px,4.4cqw,64px)`. Sections are padded `clamp(72px,9cqw,136px)` top and bottom. Fonts:
- **Display:** Georgia 700, for the two big headlines.
- **Serif:** Source Serif 4, weight 600 for headings and numbers.
- **Sans:** Schibsted Grotesk, for everything else.

The trust mock uses the app's own Georgia and system sans. Exact values are in `coastal.css`, one class per part.

| # | Section | What's there |
|---|---|---|
| 1 | Opening | **Photo band:** `home-hero.jpg` under a left-to-right coastal wash, 86% → 60% → 36%. Gold banknote lines fade in from the right (60 SVG curves at opacity .42). The band stops `clamp(64px,8cqw,112px) + clamp(176px,19.3cqw,277px)` above the bottom, so the app frame overlaps the paper.<br>**Header:** CIVIUM · How it works · Pricing · FAQ · divider · Client portal · **Create account**.<br>**H1** on two lines: "The underwriting desk / for multifamily." The last word turns through multifamily, brokers, buyers, lenders.<br>**Under it:** "Civium underwrites a multifamily deal in minutes, so brokers, buyers and lenders price it right the first time." and **Create account**.<br>**App frame:** height `clamp(420px,46cqw,660px)`, inset 8.5% each side. It holds two screens, Home and Larkspur's Pro Forma, swapping every 8s. |
| 2 | Proof numbers | Night band, two columns: "Average minutes to underwrite a deal" and "Of multifamily underwritten on Civium". Each shows a dash (or `$—`) at 40% with a "Not yet measured" pill until `stats.js` has a number. |
| 3 | A week of underwriting (`#how`) | **H2:** "A week of underwriting. Done in minutes."<br>**Beside it, orange:** "Civium does the underwriting. You make the call." and "Send the rent roll and the T-12. Civium reads both, pulls rents from the buildings around it, and returns the full underwriting in minutes, next day at the latest."<br>**Steps:** five steps (Upload, Rent Roll Analyzer, T-12 Analyzer, Market Data Analyzer, Pro Forma) beside a 4:3 app frame showing that step's screen. The active step has a 2px orange rule; the others sit at 50%. On Upload, two file chips ("Larkspur rent roll.xlsx", "Larkspur T-12.pdf") fly in and drop. |
| 4 | One deal. Every seat at the table. | Wash band. Three 4:5 photo cards: For brokers, For buyers, For lenders. Each has a coastal wash from the bottom (94% → 45% → clear at 72%). On hover the photo fades to .2 and scales 1.05, and the copy lifts 10px. |
| 5 | The plan | **H2:** "Most underwriting stops at the price. Civium shows the plan."<br>**Orange:** "Know the upside before you bid."<br>**Copy:** "Civium finds the levers in the building: rents to the comps, occupancy, utilities. Each one shows what it adds to the value, when it lands, and where the number came from."<br>**Frame:** 16:11, showing the Pro Forma's Optimization view from "Potential valuation range" down. |
| 6 | Underwriting you can defend | Wash band.<br>**Left:** the H2, the line "Every figure traces…", and three notes (In the pitch. At committee. In diligence.).<br>**Right:** a 760×540 app mock scaled to its box. A cursor clicks a number and a card opens with the equation and each source (file · page and line, or rows and column). Three examples: Worth today on the Pro Forma tab, Rents to the comps on the rent roll, and Insurance a unit on the T-12. A picker with progress bars sits underneath. |
| 7 | Your deals stay yours. | **Paragraph:** "Civium keeps every firm's deals apart and uses them for one thing: underwriting yours."<br>**Four promises,** each with a line icon in a white circle: Never shared with another firm. Never used to train anything. Yours to keep. Pooling is off. |
| 8 | Close | `home-close.jpg` under a 86% → 50% → 26% wash. "The underwriting desk for multifamily." in Georgia 700, and **Create account**. |
| 9 | Footer | CIVIUM · Austin, Texas on the left. How it works · Pricing · FAQ · Client portal on the right. |

All copy in `index.html` is final. Use it verbatim.

## Every page: header, wordmark, footer
- **Header:** CIVIUM on the left. On the right: How it works · Pricing · FAQ · divider · Client portal · **Create account**.
  - On Home it sits on the photo, in light text over a light rule.
  - On Pricing, FAQ and 404 it sits on paper, in ink over a hairline (`.h-header--paper`). The current page's link gets a 2px orange underline, 7px below the text.
  - **FAQ and 404 have no Create account button.** Their nav ends at Client portal.
  - Client portal, and the divider before it, show only while `SIGN_IN_URL` is set.
- **The wordmark** links to `/` on every page, which opens Home at the top. On Home it scrolls back to the top instead (smoothly, or instantly with reduced motion) and drops any `#how` from the address.
- **Footer:** CIVIUM · Austin, Texas on the left; How it works · Pricing · FAQ · Client portal on the right. On Pricing, FAQ and 404 a hairline sits above it at the content width.

## Pricing (`docs/pricing/index.html`, design `SitePricing.dc.html`)
- **Head** (max 760px): the eyebrow "Pricing" in orange; the H1 "Every plan gets the same underwriting." in Georgia 700, `clamp(40px,5cqw,72px)`, max 14ch; and the lead "Civium reads your model and shows it back to you next to its own base model, with every number traced to its source."
- **Three plans** in a grid: auto-fit, min 300px, gap `clamp(14px,1.6cqw,24px)`. Cards have a 2px radius, a hairline border and padding `clamp(28px,2.8cqw,40px)`, with the button pinned to the bottom. Every card has the same 38px slot under its subline so the prices line up. Only Individual fills it, with the billing toggle.

| Plan | Subline | Price | Line under the price | Button |
|---|---|---|---|---|
| Per deal | One property. | $500 a deal | Minutes for most deals, next day at the latest. | Buy one deal (`data-pay="deal"`) |
| Individual | For one broker. Every deal, all year. | Yearly: $15,000 a year. Monthly: $1,500 a month. | Yearly: "Two months free against $1,500 a month". Monthly: "Or $15,000 a year, two months free". | Get started (`data-pay="plan"`) |
| Team, on the night card | Two brokers or more. | Custom | Priced to the size of your team. | Talk to us (outline, `mailto:ccrouch@civiumcre.com`) |

- **Billing toggle:** Yearly (the default) and Monthly, two buttons with `aria-pressed`. The selected one is ink with light text. site.js's existing pricing code swaps the text of each `[data-yearly]` element and the plan button's link.
- **Where the buttons go:** both follow site.js's existing behavior.
  - Buy one deal opens `PAY_LINK_DEAL` when it's set, and emails Caden until then.
  - Get started opens `PAY_LINK_YEARLY` or `PAY_LINK_MONTHLY`, following the toggle, when set, and `SIGNUP_URL` until then.
- **Below the plans**, with a hairline above:
  - The eyebrow "Every plan includes" and four ruled lines: Your model, read and shown back to you · Civium's base model on every deal · Every number traced to its source · Rents and expenses compared against your own deals.
  - "Your deals are yours." with "Deal data belongs to whoever pays for the plan. No other account sees it."

## FAQ (`docs/faq/index.html`, design `SiteFaq.dc.html`)
- The eyebrow "FAQ" in orange and the H1 "Questions", in Georgia 700 as on Pricing.
- A `<dl>` of three rows, each with a hairline above it and one under the last.
- Each question (Source Serif 4 600, `clamp(20px,1.7cqw,23px)`) sits beside its answer (16.5px/1.65, soft) and stacks above it on narrow screens.
- deals@civiumcre.com is an orange, underlined link.
- The copy is the current FAQ's, verbatim.

## 404 (`docs/404.html`)
The FAQ's header and footer around the H1 "Not found" and an orange "Home" link.

## Motion
site.js runs all of it, with easing `cubic-bezier(.22,.61,.24,1)` unless noted. With `prefers-reduced-motion` set, none of it runs:
- The first state of each part shows: Home screen, "multifamily", step 1, example 1 with its card open.
- Steps and examples still switch on click.
- Scroll reveals don't hide anything.

| What | Behavior |
|---|---|
| Opening entrance | The H1 (0ms), the paragraph block (140ms) and the app frame (300ms) rise and fade in. They rise 18px over 1100ms, or 40px over 1500ms for the frame. |
| Photo drift | The opening photo moves scale 1 → 1.07 and translateX 0 → −1.6% over 32s. The close photo moves scale 1 → 1.06 and translateX 0 → 1.4% over 34s. Both alternate forever, ease-in-out. |
| Lines | The SVG drifts translateX −60px → 60px over 26s, alternating, ease-in-out. |
| Headline word | Every 3.8s the word fades out and rises .18em (420ms, ease-in), then the next word fades in from .18em below (700ms). |
| Opening screens | The two screens crossfade every 8s (1.4s opacity). |
| Scroll reveal | A `[data-rise="delay"]` element rises 26px and fades in over 1100ms the first time 12% of it is visible. Anything already scrolled past is left alone, and printing shows everything. Other pages keep 24px / 900ms. |
| Walkthrough | Starts when 20% of the section is visible. Each step lasts 6.5s, and a click jumps to that step and restarts the count. Screens crossfade over 1s, and the next screen loads 2.5s early.<br>On Upload, each chip runs 3000ms, starting 700ms + 450ms × chip. It flies from translate(260px,−150px) rotate(5deg) at opacity 0, is opaque by 18%, lands by 62%, presses to scale .94 at 80%, and leaves at scale .9 and opacity 0. Easing `cubic-bezier(.3,.7,.2,1)`. |
| Trust mock | Starts when 30% is visible. Each example lasts 7.5s, and a click plays it and restarts the count.<br>For each example, in order:<br>• The picker bar fills linearly over 7.5s and the tab switches.<br>• After 500ms the cursor glides to the number over 1000ms (`cubic-bezier(.4,0,.2,1)`). The first time, it comes in from 200px right and 220px down.<br>• At 1600ms it clicks (scale .82, 260ms) and the number's tile lights (orange ring, orange wash).<br>• The card rises 10px from scale .985 over 500ms, and its rows follow 280ms apart, each over 450ms, starting at 300ms. |
| Cards | On hover: the photo goes to opacity .2 over .9s and scale 1.05 over 1.6s, and the copy lifts 10px over .9s. |

## App screenshots
The capture tool opens each screen in Chromium at 1280px wide with `?theme=coastal`, which is the width every frame in the design renders before scaling down. It writes a 1x and a 2x JPEG of each. Each `<img>` sits at the top-left of its frame at 100% width, so it crops exactly as the scaled iframe did.

| File (`-1280.jpg` / `-2560.jpg`) | Screen (`ClientApp.dc.html?theme=coastal&…`) | Height at 1280 | Where |
|---|---|---|---|
| `app-home` | `screen=home` | 2048 | Opening, first |
| `app-deal` | `deal=larkspur` | 2048 | Opening, second |
| `walk-upload` | `new=1` (Start a deal) | 960 | Step 1 |
| `walk-rent-roll` | `deal=larkspur&tab=rent-roll` | 960 | Step 2 |
| `walk-t12` | `deal=larkspur&tab=t12` | 960 | Step 3 |
| `walk-market` | `deal=larkspur&tab=market` | 960 | Step 4 (waits 6s for map tiles) |
| `walk-pro-forma` | `deal=larkspur` | 960 | Step 5 |
| `plan-optimization` | `deal=larkspur&view=optimization`, scrolled so "Potential valuation range" sits 188px from the top | 880 | The plan |

- **Why 2048 for the opening screens:** that frame's height varies with the page, and a 360px phone shows about 2000px of the 1280-wide screen.
- **Clock:** the tool fixes the clock at 10:00 on Thursday, November 12, 2026 (Central), so Home reads "Good morning, Maya." If a screen comes out blank, remove the `setFixedTime` line and run it again.
- **Check each image** against the prototype's frame: Coastal colors (white, black ink, orange accents), not the gold Classic look; the map tiles present on the Market screen; and the Optimization screen starting at "Potential valuation range" with "Rents to the comps" and "Fill to the submarket" visible below.

## Live numbers
The proof band shows two numbers that come from the app. Caden sees the same numbers on his admin account.

**On the site (done in `site/`):**
- `docs/assets/stats.js` sets `window.CIVIUM_STATS = { minutesAvg, dollarsUnderwritten, deals, asOf }`. Every value starts as `null`. It loads before site.js.
- site.js fills `[data-stat="minutes"]` with the rounded number. It fills `[data-stat="dollars"]` as `$1.2B` (under $10B, one decimal, `.0` dropped), `$12B`, `$486M` or `$950K`.
- A filled number removes its "Not yet measured" pill and shows at full opacity. A null, zero or non-number value leaves the dash and the pill.
- `.github/workflows/stats.yml` runs `curl` against `https://app.civiumcre.com/api/public/stats` with `Authorization: Bearer $CIVIUM_STATS_TOKEN`. Then `node tools/write_stats.cjs stats.json docs/assets/stats.js`, then `bash tools/check_site.sh`, then it commits `docs/assets/stats.js` if it changed. Pages republishes about a minute later.
- The workflow is manual (Actions → "Homepage numbers" → Run workflow) until the endpoint exists. Then uncomment the hourly `schedule` and add the repository secret `CIVIUM_STATS_TOKEN`.

**In the product (`ccrouch-cyber/civium`), to build:**
- **Endpoint:** `GET /api/public/stats`, guarded by a bearer token compared in constant time (env `CIVIUM_STATS_TOKEN`, the same value as the site repo's secret). It returns only:
  ```json
  { "minutes_avg": 14.2, "dollars_underwritten": 1234567890, "deals": 312, "as_of": "2026-11-12T21:00:00Z" }
  ```
- **`minutes_avg`:** the mean minutes from the moment a deal has both files (rent roll and T-12) to the moment its underwriting is ready. It covers every deal underwritten, all accounts, excluding the sample deal (Larkspur Crossing) and test accounts. `null` until there's at least one.
- **`dollars_underwritten`:** the sum of each property's Worth today (the Pro Forma's current valuation, NOI ÷ cap) at its latest version, counted once per property. It covers all accounts, including Caden's own deals, and excludes the sample deal and test accounts.
- **`deals`:** the number of properties counted in `dollars_underwritten`.
- **Admin view:** on Account, for Caden's admin account only, add a "Site numbers" card. It shows the same three values and the as-of time, with the line "civiumcre.com shows these within the hour."

## Check (done means)
- [ ] `bash tools/check_site.sh` prints `check_site: green`.
- [ ] At 1440, 1024, 768 and 390 wide, each section matches the prototype: line breaks in the two headlines, the photo band ending partway down the app frame, spacing, and the cards' crop.
- [ ] The opening screens swap every 8s, and the word turns every 3.8s.
- [ ] The walkthrough starts at Upload when it scrolls into view, the chips drop in, each step's screen shows its top numbers, and clicking a step jumps to it.
- [ ] The trust mock: the cursor lands on the number, the tile lights, the card opens with rows in sequence, the picker bar fills, and clicking an example plays it.
- [ ] Card hover fades the photo and lifts the copy.
- [ ] Create account goes to `SIGNUP_URL` (app.civiumcre.com/signup) in the header, the opening and the close. Client portal goes to `SIGN_IN_URL` in the header (after the divider) and in the footer.
- [ ] The proof band reads "Not yet measured" with `stats.js` at nulls. With test numbers it shows them (try `minutesAvg: 14, dollarsUnderwritten: 486000000`), then set it back to nulls.
- [ ] With reduced motion on: everything is visible, nothing moves, and steps and examples switch on click.
- [ ] No request leaves civiumcre.com (DevTools, Network).
- [ ] Pricing: the three prices line up. Yearly and Monthly swap $15,000 a year and $1,500 a month, and the line under the price. Buy one deal, Get started and Talk to us go where "Pricing" says.
- [ ] FAQ and 404 have no Create account button. The current page is underlined in orange in the header.
- [ ] CIVIUM opens Home at the top from Pricing, FAQ and 404, and on Home it scrolls back to the top from anywhere on the page.

## What changed in site.css and site.js
- **site.css:** one addition, the `--coastal-*` tokens at the end of the existing token block. Nothing else changed.
- **site.js:**
  1. After the header's sign-in link, `[data-sign-in]` links (Home's footer) get `SIGN_IN_URL` and `SIGN_IN_LABEL`, or are removed. `[data-sign-in-sep]` (the header divider) is removed when there's no sign-in link.
  2. A Home block just before `if (reduced) return;`. It runs only on Home (when `.h-open` exists) and covers the wordmark's way back to the top, the numbers, the lines, the mock's scaling, the opening motion, the walkthrough and the trust mock.
  3. The scroll reveal uses Home's values when `.h-open` exists, skips elements already scrolled past, and shows everything on print.
  4. The header comment now names Home.

The old pages' rules in site.css are now unused: the shared header, footer and buttons, "Home 1–6", the sample page, Pricing and FAQ. So are site.js's hero entrance, parallax, bridge, receipt cards and record tilt, which are guarded and do nothing without their elements. Leave them, or remove them in a separate commit. If you remove them:
- Keep the Try it free modal's styles. Its markup stays on Home, and it shows if `SIGNUP_URL` is ever emptied.
- Keep the class names `header`, `nav`, `nav-link` and `wordmark` in the HTML. site.js finds the header by them, and coastal.css styles them.

## Assets
- **Photos** (`docs/assets/photos/`): all from Pexels, free for commercial use with no attribution required. Credits are in `licenses/PHOTOS.md`.

  | File | Size | Pexels ID | Where |
  |---|---|---|---|
  | `home-hero.jpg` | 1920×1280 | not recorded | Opening |
  | `home-card-brokers.jpg` | 1000×1511 | 22756978 | For brokers card |
  | `home-card-buyers.jpg` | 1600×1070 | 15312055 | For buyers card |
  | `home-card-lenders.jpg` | 1600×1065 | 7447655 | For lenders card |
  | `home-close.jpg` | 1600×2400 | not recorded | Close: the Porto balconies shown in the design today |
  | `home-close-galleria.jpg` | 1600×2400 | 5360473 | Alternate close: the gold Galleria roof. Not used. |

  The backup for the brokers card is Pexels 32670005.
- **Fonts** (`docs/assets/fonts/`): Source Serif 4 (variable, weights 400–700, optical size) and Schibsted Grotesk (variable, 400–600), latin and latin-ext. Both are under the SIL Open Font License; the license texts are in `licenses/`. Every page preloads the two latin files.
- **App screenshots** (`docs/assets/app/`): produced in step 3.
- **Icons:** four inline line icons in `index.html` (24px viewBox, 1.6 stroke, colored by `.h-icon`).

## Open items (don't decide these in code)
- **Privacy Policy page.** The design has a "Civium Privacy Policy →" link under the privacy paragraph. Once Caden supplies the policy and `docs/privacy/index.html` exists, add this right after that paragraph in `index.html` (it's already styled):
  `<a class="h-policy" href="/privacy/">Civium Privacy Policy →</a>`
- **Close photo.** The design currently shows the Porto balconies. Caden had earlier picked the gold Galleria roof (`home-close-galleria.jpg`). To switch, change one `src` in section 8.
- **Payment links.** Create Stripe Payment Links for Per deal ($500), Individual yearly ($15,000) and Individual monthly ($1,500). Paste them into `PAY_LINK_DEAL`, `PAY_LINK_YEARLY` and `PAY_LINK_MONTHLY`. Until then, Buy one deal emails Caden and Get started opens sign-up.
- **The app's plans** aren't part of this build. The app's onboarding pay step still shows the old Team price, where the site now says custom, and onboarding offers one free deal while Pricing sells one for $500. Caden decides how those line up.
- **The trust mock's sources** (page and line numbers, comp counts) are illustrative for the sample deal. The numbers themselves are Larkspur's.
- **The app screenshots show a fixed date** (Thursday, November 12). Re-run the capture tool whenever the app's screens change.

## Files
- `site/`: the build, mirroring the repo root (see Steps, step 2).
- `capture/capture-app-shots.cjs`, `capture/package.json`: the screenshot tool.
- `prototype/`: the design, running. Never commit it.
  - `templates/site-home/HomeV4.dc.html` is the homepage. `SitePricing.dc.html` and `SiteFaq.dc.html` are Pricing and FAQ.
  - `templates/client-app/` is the app the frames show.
  - `styles.css`, `tokens/` and `_ds_bundle.js` are the design system it loads.
- `preview/`: the design tool's preview of `site/` (`index.html?page=home`, `pricing`, `faq` or `404`), with placeholder screenshots. Ignored.
