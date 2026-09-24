# Civium design system — notes for /design-sync

What this folder is: the Civium design system as static files, built on
2026-09-24 from the product's own stylesheet (`frontend/src/index.css` in
the private product repo, at `main@20c085b`). Nothing here was invented;
every value is the app's.

- `tokens.css` — the app's `:root` custom properties, verbatim (colors,
  the two font stacks, spacing, shadows, focus rings).
- `tokens.json` — the same tokens as lists: 21 colors (one theme, light),
  11 text styles in two families (serif for names and headline numbers,
  sans for everything else; tabular lining numerals), 5 spacing steps,
  6 radii, 4 shadows.
- `README.md` — the brand book (content rules, visual foundations, the
  receipt as the signature).
- `components/<Name>/preview.html` — one static HTML rendition per
  component, self-contained (its CSS inline). Line 1 of each is a
  `<!-- @dsCard group="…" height=… -->` marker naming its group.
  `components/<Name>/README.md` — that component's guidelines.
  `components/Cover/preview.html` — the cover.

There are NO React components and no bundle. The product's real UI is
one stylesheet of class names plus page-level React modules; the
component renditions here are those classes rendered as plain HTML.
Sync these files as they are. Do not generate substitute components,
colors or fonts. The system's name is "Civium".
