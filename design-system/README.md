# Civium

Warm paper, gold and ink, serif headings, tabular numerals everywhere. Civium reads a seller's rent roll and T-12 with deterministic code and shows the buyer's team every number with its receipt. The system is the product's own look, lifted exactly from the app's stylesheet (`frontend/src/index.css` at `main@20c085b`) so the website and the software read as one thing. Two faces consume it: the product at app.civiumcre.com and the marketing site at civiumcre.com.

## Content fundamentals

- **Plain words.** Desk words, never jargon. A sentence says one thing and has a verb. "with Civium", not "escalated"; "ready", not "promoted".
- **Bare numbers on the face, every caveat behind the click.** A number stands alone in `metric` or `body`; its origin, its equation and its inputs open on hover (the receipt). No footnote clutter beside a figure.
- **Never a dressed number.** No "zero errors", no "100% accurate", no rounded-up claims. A figure on the site is the demo deal's own and is labeled a sample; its arithmetic closes to the dollar.
- **No "AI" in a headline.** The one honest paragraph about the model lives in a FAQ, in the product's own sentence: a model speaks only over the rows the reader could not class, only behind a key the house sets; a second call tries to refuse each answer; the lane's own checks have the last word; what it did is recorded.
- **Promise only what the product does today.** Drop the seller's rent roll and T-12, or forward them to deals@civiumcre.com; they read on the server and land as a deal when ready; anything the reader cannot settle goes to Civium, and you hear within a day. Invite only. A team is a workspace. A team never sees another team's deal, file, or that it exists.
- **The word "house".** On a customer's own pages "the house" means their firm (the House Book, house rules). Civium refers to itself as Civium.

## Visual foundations

- **Ground.** Pages sit on `paper`; content sits on `card` with a 1px `line` border and `shadow-1`. Borders carry the edge; shadows are a whisper (`shadow-2` only on a hovered, clickable card). Panels inside a card use `wash` with `line`. Table rows alternate with `zebra`.
- **Ink.** Text is `ink`; secondary text `ink-soft`; muted `fade`; the faintest `faint`. Text on a gold or ink fill is `on-gold`.
- **Gold.** `gold` is the one accent: the brand mark, the primary button, focus rings, the active tab's underline, a pill that is on. `gold-deep` is gold as text (links, ghost buttons, the primary eyebrow). `gold-wash` is the hover ground; `gold-soft` the tint. Gold is never a background for text blocks.
- **Signals.** `green` / `green-wash` for a value that helps and the READY tag; `red` / `red-wash` for a value that hurts, error text and the with-Civium / refused tag; `amber` for an assumption; `orange` for a flag. Positive and negative differ in lightness as well as hue.
- **Type.** Serif (`serif` family, Georgia and its kin) for names and headline numbers: the brand mark, page titles, metric values, section heads, tabs. Sans for everything else. Numerals are tabular and lining in every style. The brand mark is the word CIVIUM in `brand` (24px, 7px tracking) in `gold`; there is no logo file and the mark is type on purpose.
- **Rhythm.** 4 / 8 / 12 / 16 (`sp-1` … `sp-4`), the shell gutter 24px (`gutter`); the shell is at most 1180px wide.
- **Corners.** Cards `radius-card` (10px), panels `radius-panel` (8px), controls `radius-control` (6px), tags `radius-tag`, pills `radius-pill`. Nothing sharper than 5px, nothing rounder than a pill.

## Iconography

There are no icons. Direction is carried by words and arrows ("→ open Larkspur Crossing", "← deals"), state by a tag's word and its ground, emphasis by the serif face. A mark that needs an image needs a decision first; until then it is type and a note.

## The signature: the receipt

Every number on every face is a receipt. Hover it and a card opens: the number, the equation with the numbers in it, each input with its origin (a statement row and its cells, a unit line, a dated capture, a ruling's who and when, a house default). Click and the chain walks. The product's own component (`frontend/src/receipt.jsx`: `Cite` + `ReceiptProvider`) IS the design; the site does not re-implement it. When a sample on the site needs a receipt, it embeds the product's, over the demo deal's own numbers.

## Components

Rendered here as static renditions styled by the tokens (the app's classes, hand-copied from `index.css`); the product's React components are the source of truth.

- **Button** — `btn-primary` (gold fill, `on-gold` text) for the one act on a card; `btn-ghost` (gold outline, `gold-deep` text) beside it; `btn-ink` for a rare heavy act; `btn-link` for an inline act; `btn-sm` for a row's verbs. A disabled button is 45% opaque.
- **Tag** — a state word: default (`fade` on `line`), `good` (READY), `warn` (with Civium, refused), `gold` (the primary), `assume` (`amber`, an assumption).
- **Pill** — a filter chip: gold outline, `on` fills gold.
- **Eyebrow** — an uppercase label above a block; `gold` for the block that matters.
- **Card** — the surface; `click` lifts on hover.
- **Input** — one style for text and select; focus turns the border gold with `ring`; `bad` turns it red with `ring-red`; `busy` washes it gold.
- **Tabs** — serif labels on a hairline; the active one in `ink` with a 2px gold underline.
- **Receipt** — the signature, above; the rendition here shows the card at rest.

## Usage rules that name tokens

- A page: `paper` ground, one `h-page` title in serif, cards on `card` with `line` and `radius-card`, `gutter` at the sides.
- A card that holds one act: an `eyebrow` (gold if primary), a `tiny` `fade` line saying what happens, then the control; the act's button is `btn-primary`; a second act is `btn-ghost`; never two primaries.
- A state: a `tag` with the state's word, `good` or `warn` ground, beside the thing it describes; the reason in `tiny` on the next line; the detail behind a click.
- A number: serif in `metric` when it is the headline; `body` with tabular numerals in a table; right-aligned; `pos` / `neg` only when the sign is the point.
- Focus is visible: `ring` on inputs, a 2px `gold` outline on a button-like zone.
- Contrast: `ink` on `paper`/`card` and `gold-deep` on `paper` pass 4.5:1; `fade` on `paper` is for secondary text at 11px and up only; `gold` (#b49a5c) is never used for small text on paper.

## Not synced

No font files: the app uses system stacks (Georgia and the system sans), so `type.fonts` is empty and `type.families` carries the stacks. No logo file exists; the mark is type. The components are hand-written static renditions from `index.css`, not a built bundle: the product's React components (`frontend/src/*.jsx`) were not bundled, on purpose, until Caden rules on the brand's direction on the canvas. Skipped as not tokens: the app's one-off literals (`#d5c9a9` hovered card border, `#d8cfb8` input border, `#453e33` hovered ink button, `#e0cf9f` assume border) — they are listed here so a later pass can promote or retire them.
