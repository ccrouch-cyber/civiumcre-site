# Civium Design System

Civium does deterministic verification of commercial real estate underwriting for the buyer's team. A customer drops a seller's rent roll and T-12; Civium re-derives every number with deterministic code and shows each one with its receipt. Two faces share one look: the product (web app, app.civiumcre.com) and the marketing site (civiumcre.com).

## Sources
- GitHub: https://github.com/ccrouch-cyber/civiumcre-site — `design-system/` (README brand book, `tokens.css`, `tokens.json`, `components/<Name>/preview.html` + `README.md`, `SYNC_NOTES.md`) and the live holding page `index.html`. Explore it further when building for Civium.
- The design system was lifted from the private product repo `ccrouch-cyber/civium` (`frontend/src/index.css` at `main@20c085b`; `frontend/src/receipt.jsx` for the Receipt). Not accessible here.

## Content fundamentals
- **Plain desk words.** A sentence says one thing and has a verb. "with Civium", not "escalated"; "ready", not "promoted".
- **Lowercase UI copy.** Buttons, pills, tags and hints are lowercase ("sign out", "re-run", "ready", "with Civium", "shown once — send it yourself"). The single primary act can be sentence case ("Set password and enter"). Eyebrows are uppercase via CSS ("DROP A DEAL").
- **You / Civium.** The reader is "you" ("you hear within a day"). Civium calls itself Civium, never "we". On a customer's pages "the house" means their firm (House Book, house rules).
- **Bare numbers, caveats behind the click.** A number stands alone; its origin and equation open in the receipt. No footnotes beside figures.
- **Never a dressed number.** No "zero errors", "100% accurate", rounded-up claims. Site figures are the demo deal's own, labeled sample, and close to the dollar.
- **No "AI" in a headline.** The model is described once, in a FAQ, in the product's own sentence.
- **Promise only what ships today.** Drop or forward to deals@civiumcre.com; invite only; a team is a workspace and never sees another team's deal.
- **Direction by words and arrows:** "→ open Larkspur Crossing", "← deals", "→ open the chain". Middle dot separates facts: "with Civium · you will hear within a day", "Sheet1!7 · Market Rent".
- No emoji. No exclamation marks.

## Visual foundations
- **Color.** Warm paper `--paper` #f6f1e6 page; `--card` #fffdf8 surfaces; `--wash` panels; `--zebra` alternate rows. Ink `--ink` #2b2620 text, `--ink-soft` secondary, `--fade` muted (11px+ only), `--faint` hairlines. One accent: `--gold` #b49a5c (brand mark, primary button, focus, active tab underline, pill on); `--gold-deep` #997f43 is gold as text; `--gold-wash` hover ground; `--gold-soft` tint. Gold is never a text-block background and never small text on paper. Signals only: green (helps, READY), red (hurts, error, with Civium/refused), amber (assumption), orange (flag). Light theme only.
- **Type.** Serif (Georgia stack) for names, titles, headline numbers, section heads, tabs. System sans for everything else. Tabular lining numerals everywhere. Scale: brand 24/7px track · h-page 21 · metric 19 · h-section 16 · tab 14.5 · body 13 · control 12.5 · small 12 · tiny 11 · eyebrow 10.5/1.6px · tag 10. All weight 400 — hierarchy comes from face and size, not bold.
- **No webfonts.** System stacks by design; nothing to substitute.
- **Spacing.** 4/8/12/16 (`--sp-1..4`), gutter 24, shell max 1180. Card padding 14px 16px; grids 14–16px gap.
- **Corners.** Cards 10, panels 8, controls 6, small buttons 5, tags 9 (full pill), pills 14 (11 small). Nothing sharper than 5px.
- **Borders and shadows.** 1px `--line` borders carry edges. `--shadow-1` barely there at rest; `--shadow-2` only on a hovered clickable card (border darkens to #d5c9a9). No inner shadows.
- **Backgrounds.** Flat paper. No imagery, gradients, textures, patterns, blur or transparency effects. The Cover uses flat gold/ink/tint tiles at radius 10 with hairline rules — the only compositional motif.
- **States.** Hover: primary → gold-deep fill; ghost/pill → gold-wash; ink → #453e33; tab → ink-soft; clickable card lifts. Focus: `--ring` (gold, 3px) on inputs, 2px gold outline on button-like zones. Bad: red border + `--ring-red`. Busy: gold border + gold-wash. Disabled: 45% opacity (buttons), wash ground (inputs). No press/shrink effect.
- **Motion.** None defined in the source; changes are instant. Don't add bounces or fades.
- **Layout.** Header: brand mark on a `--line` rule. One `h-page` title per page, one row of tabs (the lanes). Cards hold one idea: eyebrow → tiny fade line → the control. Never two primaries in a card. Numbers right-aligned in tables.

## Iconography
There are no icons, no icon font, no SVG sprites, no emoji. Direction is carried by words and arrows (→ ←), state by a Tag's word and ground, emphasis by the serif face. Unicode used as glyphs: → ← · … Σ ÷ −. Do not add an icon set. The brand mark is the word CIVIUM in serif type (24px, 7px tracking, gold) — **there is no logo file**, on purpose; `assets/` is intentionally empty.

## The signature: the receipt
Every number is a receipt. Hover it and a card opens: the number, the equation with its numbers, each input with its origin (statement row and cell, unit line, dated capture, a ruling's who and when, a house default). Click and the chain walks. The product's `receipt.jsx` is the source of truth; `Receipt` here is a cosmetic rendition.

## Components
Built from the source inventory (design-system/components) — no additions.
- **Button** (`components/actions`) — primary / ghost / ink / link; sm; disabled.
- **Pill** (`components/actions`) — filter chip; on; sm.
- **Tag** (`components/signals`) — default / good / warn / gold / assume.
- **Eyebrow** (`components/type`) — uppercase label; gold.
- **Card** (`components/surfaces`) — surface with optional eyebrow + hint; clickable.
- **Input** (`components/inputs`) — text or select; bad / busy / focus; label + unit.
- **Tabs** (`components/navigation`) — serif lanes with gold underline.
- **Receipt** (`components/signature`) — number + receipt card; hover or static.
- **Cover** — brand card only (`guidelines/brand-cover.html`), not a component.

## Index
- `styles.css` — entry; imports `tokens/civium.css` (the app's :root, verbatim), `tokens/system.css` (on-gold, radii, gutter, type styles, semantic aliases — values from tokens.json), `tokens/base.css` (body defaults, `.mut .tiny .serif .metric .pos .neg`).
- `components/` — the 8 components (`.jsx`, `.d.ts`, `.prompt.md`, one card per folder).
- `guidelines/` — foundation cards: colors, type, numerals, spacing, radii, shadows, brand mark, cover.
- `ui_kits/site/` — civiumcre.com holding page (exact).
- `ui_kits/product/` — product composition (sign in → desk → deal). Not a recreation; product source is private.
- `thumbnail.html`, `SKILL.md`, `github.md`.

## Not synced / open
Source one-off literals kept as literals: `#d5c9a9` hovered card border, `#d8cfb8` input border (unused; previews use `line`), `#453e33` hovered ink button, `#e0cf9f` assume border (previews use `gold-soft`).
