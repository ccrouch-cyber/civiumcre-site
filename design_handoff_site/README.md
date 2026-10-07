# Handoff: civiumcre.com marketing site (Home, Pricing, FAQ)

## Start here (for Claude Code)
- **Target repo:** `ccrouch-cyber/civiumcre-site`, branch `main`. Its root `index.html` is the current holding page and gets replaced by the new Home. Pricing and FAQ become new pages.
- **Where this bundle lives:** put this folder in the repo root as `design_handoff_site/`. Everything you need is in this folder: this README plus `design/`.
- **Tokens already exist in the repo** at `design-system/tokens.css` / `tokens.json`. Their values match `design/tokens/*.css`. Use the repo's tokens and don't create new ones.
- **To run the prototype:** serve this folder over HTTP (for example `npx serve design_handoff_site`), then open `design/site-home/HomeV3.dc.html`. Opening it as `file://` won't load the scripts.

## About the design files
The files in `design/` are **design references built in HTML**. They are prototypes of the intended look, copy and behavior, not production code. Rebuild them in the site repo's own setup. If the repo is still a static site, plain HTML, CSS and a small JS file are enough; no framework is needed.

How to read a `.dc.html` file:
- All styling is inline `style="…"`. `style-hover="…"` means the `:hover` rule.
- `{{ name }}` holes, `<sc-if>` (conditional) and `<sc-for>` (loop) are filled from the `class Component` block at the bottom of the file. That block is plain React-style state. Read it for exact behavior and timings.
- `<dc-import name="SamplePage">` embeds `SamplePage.dc.html` inline.
- `support.js`, `ds-base.js` and `_ds_bundle.js` are prototype runtime. **Don't port them.**

## Fidelity
**High-fidelity.** Copy, colors, type, spacing and motion are final; match them. The sample deal "Larkspur Crossing" is invented. Keep it on the site and keep it labeled as a sample.

## Global
- **Root:** `--paper` background, `--ink` text, `--sans`, `font-variant-numeric: tabular-nums lining-nums`, `overflow-x: clip`.
- **Fluid sizing:** sizes use `clamp(…, Ncqw, …)` against `container-type: inline-size` on the root. Using `vw` instead of `cqw` is fine on a real full-width page.
- **Content width:** the max is 1240px (1320px in the hero). Side padding is `clamp(20px,4cqw,64px)`.
- **Default links:** `--gold-deep`; hover `--ink`.
- **Eyebrow:** sans 11.5px/1, letter-spacing 1.6px, uppercase, `--fade`. On the dark receipt section it's `--gold-soft`.
- **Section H2:** serif 400, `clamp(34px,4cqw,60px)/1.06`, letter-spacing -.015em, `text-wrap: balance`, 20px below the eyebrow.
- **Body lead:** sans 17px/1.65 in `--ink-soft`, max-width about 30em, `text-wrap: pretty`.
- **Primary button:** `--gold` background, `--on-gold` (#fff) text, sans 15px, padding 16×24 (14×22 in the footer, 11×16 in the nav), `--radius-control` (6px). Hover is `--gold-deep`.
- **Responsive:** every multi-column block is `grid-template-columns: repeat(auto-fit, minmax(min(100%, Npx), 1fr))`, so columns stack on their own on a phone. The design was checked at 1440 and 390 wide.

### Header (all pages)
- One row (flex, wraps), padding 22px 0, with a 1px bottom border.
- **Left:** the wordmark "CIVIUM", serif 20px, letter-spacing 7px, `--gold`. It links to Home.
- **Right:** the nav, sans 14px, gap `clamp(16px,2.4cqw,32px)`:
  - **How it works** goes to `/#how`
  - **Pricing** goes to `/pricing`
  - **FAQ** goes to `/faq`
  - **Try it free** is the primary button
- **On Home** the header sits on the dark hero: text is `--paper`, the border is `rgba(246,241,230,.14)`, and links hover to opacity .7.
- **On Pricing and FAQ** it's on paper: text is `--ink`, the border is `--line`, and the current page gets a 1px `--gold` underline (padding-bottom 4px).

### Footer
- 1px `--ink` top border. A grid of labeled cells (auto-fit, min 190px), aligned to the end.
- Each cell is an 11px uppercase `--fade` label over a serif 20px value:
  - **Name:** Caden Crouch
  - **Firm:** Civium (Home only)
  - **Based in:** Austin, Texas
  - **Covers:** Texas multifamily
  - **Email:** ccrouch@civiumcre.com, a `mailto:` link in serif 18px
- **Home only:** the last cell holds a **Try it free** button and links to Pricing and FAQ.

## Page 1: Home (`design/site-home/HomeV3.dc.html`)
The sections run in this order.

### 1. Hero (dark)
- **Background:** `--ink`, a radial gold glow (`radial-gradient(55% 70% at 80% 35%, rgba(180,154,92,.22), transparent 70%)`), and a film-grain overlay (see Assets) at opacity .45 with `mix-blend-mode: overlay`.
- **Layout:** two columns (auto-fit, min 460px), gap `56px clamp(32px,5cqw,88px)`, padding `clamp(48px,7cqw,112px) 0 clamp(64px,8cqw,128px)`.

**Left column**
- **Eyebrow:** "Caden Crouch · Austin, Texas" in `--faint`.
- **H1:** "Institutional underwriting for Texas multifamily." Serif 400, `clamp(42px,5.6cqw,84px)/1.02`, letter-spacing -.02em.
- **Lead** (sans 18px/1.6, `--faint`, max 33em): "What the property you're pitching is worth today and where the upside is, back in minutes. Underwritten the way the buy side does it, with every number traced to its source."
- **Actions:** the **Try it free** primary button (with shadow `0 10px 30px -10px rgba(180,154,92,.7)`), then the link "See a sample page" pointing to `#value`. The link is `--paper` with a 1px underline at 30% paper.
- **Note** (13px, `--faint`): "Two files in. No card to start."

**Right column: the "stage"** (min-height `clamp(420px,46cqw,660px)`), three layers:
1. **Building image:** inset `0 0 7% 14%`, radius 16px, `#1d1915` fill, shadow `0 50px 90px -30px rgba(0,0,0,.6)`.
   - On top of the image: a bottom-darkening gradient, grain at .3, and a light sweep. The sweep is a 100° gradient, `rgba(255,244,214,.16)` at center.
2. **Sample page** (`SamplePage.dc.html`) at the bottom-left, width `min(56%,330px)`, resting at `perspective(1600px) rotateY(10deg) rotateX(3deg)` with a drop shadow.
3. **Chip** at top 7%, right 4%: a card with radius 12px, max 220px.
   - Eyebrow "Rents vs. comps"
   - "+$85" in serif 26px, `--green`
   - "a unit, a month, under today's comps"

### 2. What you get (`#value`)
- Two columns (min 420px).
- **Left:**
  - Eyebrow "What you get"
  - H2 "See where the value is before the owner meeting."
  - Lead: "Civium checks every line that moves NOI: rents against today's comps, insurance, utilities and taxes against what your other deals pay, and the cap rate the market is paying. You see where the value can go and how much it adds."
- **Right, the value bridge card:**
  - Behind the card sits a `--wash` card rotated 1.5° and offset 14/18px.
  - The card itself is `--card`, radius 14px, padding `clamp(22px,3cqw,36px)`.
  - **Card header:** "Larkspur Crossing" (serif 22px), "96 units · sample deal" (12.5px `--fade`), and a **Replay** pill button.
  - **Rows:** each has a label, a subline, a value (serif 20px with a dotted `--gold-deep` underline), and a horizontal bar under it. The bars stack like a waterfall: each one starts where the previous one ends.

| Row | Subline | Value | Bar (left / width) | Color |
|---|---|---|---|---|
| Worth today | The seller's NOI of $652,960 at a 6.50% cap | $10,045,538 | 0 / 83.7% | `--ink-soft` |
| Rents to market | 96 units renting $85 a month under the comps | +$1,506,462 | 83.7% / 12.55% | `--green` |
| Insurance to your deals | $250 a unit a year above what your other deals pay | +$369,231 | 96.26% / 3.08% | `--green` |
| **What Civium finds** · The number to walk in with | n/a | $11,921,231 (serif 24px) | 0 / 99.34% | `--gold`, row on `--gold-wash` |

  - **Footnote:** "Rents come from the comps. Insurance comes from your own deals."

### 3. How it works (`#how`)
- `--wash` band with 1px `--line` borders at top and bottom.
- **Header row:** the H2 "Send the files. Civium does the math." on the left; on the right, "Minutes for most deals. Next day at the latest." (16px, `--ink-soft`).
- **Three step cards** in an `<ol>` (auto-fit, min 300px, gap 20px):
  - Cards are `--card`, radius 14px, padding 28px.
  - Each has a big step number (serif 48px, `--gold-deep`), a role eyebrow on the right, and the step in serif 22px/1.3.
  - Each step has pills: `--wash` background, a 1px `--line` border, a 6px gold dot, 12.5px text.
  - On hover a card lifts 6px with shadow `0 24px 48px -24px rgba(43,38,32,.35)` (.35s).

| # | Role | Step | Pills |
|---|---|---|---|
| 1 | You | Send the rent roll, T-12, and your model if you have one. | Rent roll · T-12 · Your model |
| 2 | Civium | Civium finds the upside. | Rents vs. comps · Expenses vs. your deals · Market cap rate |
| 3 | You | Walk in with the upside. | Your model beside Civium's · Every number sourced |

### 4. The receipt (dark)
- `--ink` background with grain and a gold glow at 75% 55%.
- **Left:**
  - Eyebrow "The receipt"
  - H2 "Every number shows where it came from."
  - Lead (`--faint`): "Tap a number and its source opens, down to the line in the seller's T-12."
- **Right, two stacked source cards plus a formula:**
  - **NOI card:** "Source · T-12 statement / Larkspur Crossing, trailing 12 months"
    - Gross potential rent: 1,382,400
    - Vacancy and loss: (114,739)
    - Operating expenses: (614,701)
    - Net operating income: 652,960
  - **Cap card:** "Source · Sales comps / Three garden trades, last 12 months"
    - Sale 1 · 112 units: 6.35%
    - Sale 2 · 88 units: 6.55%
    - Sale 3 · 140 units: 6.60%
    - Market cap rate, average: 6.50%
  - **Formula:** "Worth today $10,045,538 = [$652,960] ÷ [6.50%]", captioned "Net operating income over the market cap rate". The two bracketed values are buttons.

### 5. The record
- Centered, max 1000px.
- Eyebrow "The record".
- **H2:** "$200M of multifamily underwritten on the buy side." Serif `clamp(36px,4.4cqw,64px)`, max 16ch.
- **Line (verbatim, approved):** "Civium underwrites the way buyers do, so the numbers hold up on the other side of the table."
- **Below:** a stack of three pages, max 440px wide: two backing sheets rotated -4° and +3°, with `SamplePage` on top.
- **Caption:** "Larkspur Crossing, a sample deal — invented property, real method."

### 6. Privacy
- Top border. Three columns: the eyebrow "Privacy", then two items with a serif 22px title and a 15.5px body:
  - **Private to your team.** A team never sees another team's deal, file, or that it exists.
  - **View-only until you choose.** A free preview opens on a private link for 7 days. Exporting starts a 15-day free trial.

### 7. Footer
See Global.

### Try it free flow (modal)
- **Overlay:** `rgba(29,25,21,.55)` with a 6px backdrop blur. Clicking outside the panel closes it.
- **Panel:** `--card`, width min(100%,480px), radius 16px, padding 32px, shadow `0 40px 100px -30px rgba(0,0,0,.6)`. It shows a small CIVIUM wordmark and a **Close** button.

**Step 1**
- Title "Try it free" (serif 30px).
- Text: "Send the rent roll and T-12 on a property you're pitching. Civium's underwriting comes back on a private link in minutes, next day at the latest."
- Two dashed upload tiles, **Rent roll** and **T-12**, reading "Drop or choose a file".
  - Once a file is attached, the tile turns `--gold-wash` with a `--gold` border and shows the filename.
- An email input, the **Send for underwriting** button, and the note "No card needed. View-only for 7 days."

**Step 2**
- "Received" / "Your underwriting is on its way."
- "It arrives in minutes, by tomorrow at the latest, at a private, view-only link that stays open for 7 days."
- "Want to export it?" / "Add a card to start a 15-day free trial. Cancel anytime before it ends."
- The **Add a card** button.

**Step 3**
- "Member · 15-day trial" / "You're in."
- A list:
  - Export any deal
  - One customization to your workspace each month
  - A standing monthly meeting with Caden, and a booking link if the time doesn't work
- The **Done** button.

## Page 2: Pricing (`design/site-home/SitePricing.dc.html`)

**Top of page**
- Eyebrow "Pricing".
- H1 "Every plan gets the same underwriting." (serif `clamp(40px,5cqw,72px)`, max 14ch).
- Lead: "Civium reads your model and shows it back to you next to its own base model, with every number traced to its source."
- **Billing toggle** at the top right: a pill with **Yearly** and **Monthly**. Yearly is the default. The selected option is an `--ink` fill with `--paper` text.

**Plan cards** (auto-fit, min 300px, gap 20px): `--card`, radius 14px, padding 32px. Each shows the name (serif 26px), a subline, the price (serif 52px) with its period, an alt line, and a full-width button pinned to the bottom.

| Plan | Subline | Yearly | Monthly | Button |
|---|---|---|---|---|
| Individual | For one broker. | $15,000 a year · "Two months free against $1,500 a month" | $1,500 a month · "Or $15,000 a year, two months free" | Get started |
| Team | Up to 10 people. | $50,000 a year · "Two months free against $5,000 a month" | $5,000 a month · "Or $50,000 a year, two months free" | Get started |
| Enterprise | More than 10 people. | Custom · "Priced to the size of your team." | same | Talk to us |

All buttons are currently `mailto:ccrouch@civiumcre.com`.

**Below the cards** (top border, three columns):
- The eyebrow "Every plan includes", with a ruled list:
  - Your model, read and shown back to you
  - Civium's base model on every deal
  - Every number traced to its source
  - Rents and expenses compared against your own deals
- **Your deals are yours.** "Deal data belongs to whoever pays for the plan. No other account sees it."

## Page 3: FAQ (`design/site-home/SiteFaq.dc.html`)
- Eyebrow "FAQ" and the H1 "Questions".
- A `<dl>` of rows. Each row has a 1px top border and padding 28px 0. The question is serif 22px; the answer is 16px/1.65 `--ink-soft` and spans two grid columns.
- Use the copy in the file verbatim. The questions are:
  - Is this AI?
  - What do you need from me?
  - How fast?
- deals@civiumcre.com is a link.

## Interactions and motion
All of this lives in `componentDidMount` / `playBridge` in HomeV3. The shared easing is `cubic-bezier(.2,.7,.2,1)`. **Respect `prefers-reduced-motion`:** with it set, skip all of the motion and show the final state.

**Hero entrance**
- **Image:** scale 1.16 → 1, opacity 0 → 1, blur 10px → 0, over 2400ms. After that it zooms slowly, 1 → 1.06, over 18s, alternating forever.
- **Sample page:** comes in from `rotateY(28deg) rotateX(10deg) translateY(70px)`, opacity 0, over 1500ms after a 400ms delay.
- **Chip:** rises 16px and scales .96 → 1, over 900ms after a 1500ms delay.
- **Sweep:** a light passes across the image every 9s (the pass takes the first 28% of the cycle), starting after 1.2s.

**Hero parallax**
- Track the pointer over the stage as -.5….5 on each axis.
- The layers translate by these multiples of that value: image 10/8px, page -18/-12px, chip -26/-18px.
- Transitions are .6s. Reset to 0 when the pointer leaves.

**Scroll reveals**
- Elements marked `data-rise="delayMs"` fade in and rise 24px over 900ms the first time 12% of them is in view.

**Value bridge**
- The animation plays once, when 35% of the card is visible.
- The rows come in one after another, 520ms apart. Each row fades and rises 10px over 600ms.
- Each bar grows from the left (scaleX 0 → 1) over 900ms while its number counts up from 0 (ease-out cubic).
- **Replay** runs the animation again.

**Receipt cards**
- The NOI card and the Cap card take turns on top every 3.6s until the user hovers over or clicks one of the formula buttons. After that, the user's choice sticks.
- **Active card:** `translate(0,0) scale(1)`, opacity 1.
- **Inactive card:** `translate(30px,-30px) scale(.94)`, opacity .45. Transitions are .7s.
- The matching formula button and the source row turn `--gold-wash`. The row's top border turns `--gold`.

**Record pages**
- As the stack scrolls in, it untilts from `rotateX(22deg) translateY(50px)` to flat. It is fully flat once its top is 75% of a viewport above the bottom of the screen.

**Try it free modal**
- Steps go 1 → 2 → 3. Closing the modal resets the attached files.
- In production, step 1 is a real upload (to deals@ or the app's intake) and step 2 sends a confirmation. The "Add a card" step needs payments wired up (TBD; see Open items).

## State (Home)
- `flow`: 0 (closed) or 1/2/3, the modal step
- `rr`, `t12`: booleans, file attached
- `src`: `'noi' | 'cap'`, the receipt card on top
- `userSrc`: stops the auto-rotation once the user picks a card
- Preview length: 7 days. It was a tweak in the prototype (3 or 7); ship 7.

## Design tokens
These are in `design/tokens/civium.css` and `system.css`, and match `design-system/tokens.css` in the repo.

**Colors**
- **Gold:** `--gold #b49a5c`, `--gold-deep #997f43`, `--gold-soft #e8dcbf`, `--gold-wash #faf4e3`, `--on-gold #ffffff`
- **Ink:** `--ink #2b2620`, `--ink-soft #5d5546`, `--fade #8a7f6d`, `--faint #cfc6b0`
- **Surfaces:** `--paper #f6f1e6`, `--card #fffdf8`, `--wash #faf6ea`, `--line #e4dcc8`, `--line-soft #efe8d6`
- **Signals:** `--green #3f7d3f`, `--green-wash #eef3e9`, `--red #a33232`
- **Dark-section extra:** `#1d1915`, used behind the hero image and as the overlay base

**Type**
- **Fonts:** both are system stacks, with no webfonts.
  - `--serif`: Georgia, 'Iowan Old Style', 'Times New Roman', serif
  - `--sans`: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif

**Radii, shadows, spacing**
- **Radii:** `--radius-control 6px`, `--radius-control-sm 5px`, `--radius-pill 14px`. Large cards use 14px and the hero image uses 16px.
- **Shadows:** `--shadow-1 0 1px 2px rgba(43,38,32,.05)` and `--shadow-2 0 5px 16px rgba(43,38,32,.10)`, plus the one-off shadows noted above.
- **Spacing:** sections use `clamp()` padding, about 72–150px vertically depending on the section (exact values are inline).

## Assets
- **Hero building image:** a placeholder slot (`image-slot id="hero-building"`). Caden will supply a real photo or render, and it should fill the slot with `object-fit: cover`.
- **Film grain:** an inline SVG `feTurbulence` noise (baseFrequency .85, 3 octaves, desaturated, 180px tile). It's applied at runtime as a background image to `[data-grain]` elements. The exact SVG string is in HomeV3's `componentDidMount`.
- No icons, no webfonts.

## Open items (don't decide these in code)
- **CTA wording:** "Try it free" is parked. Keep it for now, but build it as one string so it's easy to change.
- **Free preview and trial:** it's undecided whether a free first deal or trial exists at all. The Privacy section's second item and steps 2–3 of the modal depend on that answer. Build them so they can be switched off.
- **SamplePage copy is under review.** The text in the sample page ("Owner's page", "A buyer's model", "The owner nets, before taxes", "Civium · Houston, Texas") is about to change. Build the sample page so its copy is easy to edit.

## Files
- `design/site-home/HomeV3.dc.html`: Home
- `design/site-home/SitePricing.dc.html`: Pricing
- `design/site-home/SiteFaq.dc.html`: FAQ
- `design/site-home/SamplePage.dc.html`: the sample page embedded in the hero and in The record
- `design/styles.css`, `design/tokens/*.css`: tokens
- `design/site-home/support.js`, `ds-base.js`, `image-slot.js`, `design/_ds_bundle.js`: prototype runtime, reference only
