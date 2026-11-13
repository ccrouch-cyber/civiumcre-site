# civiumcre.com

The public marketing site for Civium. GitHub Pages serves the `docs/` folder of
`main`; only what is in `docs/` is published on civiumcre.com.
The product lives in the private repository `ccrouch-cyber/civium` and runs
at app.civiumcre.com; nothing confidential belongs here.

## The pages

- `docs/index.html` (Home), `docs/pricing/`, `docs/faq/`, `docs/404.html`, and `docs/start/`
  (the Get started window on a page of its own).
- `docs/assets/site.js` is the site's one script. Its first lines are the settings: the words
  on the Get started button, where each button goes, and the scheduling page for the booking
  view (empty until there is one; the booking buttons write an email until then).
- `docs/assets/site.css` holds every colour, shadow and font stack as a token;
  `docs/assets/coastal.css` holds the pages' and the window's styles.
- `docs/assets/stats.js` holds the homepage's two proof numbers. `.github/workflows/stats.yml`
  and `tools/write_stats.cjs` rewrite it once the app publishes them; until then the page
  reads "Not yet measured".

## Checks

`bash tools/check_site.sh` must end `check_site: green` before anything is published. It
holds the site's rules: every link and picture resolves, every colour is a token, nothing
loads from another host but the one configured scheduling page, the Get started window is
built once, and the script asks the network for nothing.

## Where the pages come from

- `design_handoff_homepage/README.md` is the design's notes for Home, FAQ and 404: layout,
  copy and motion. Its `capture/` tool makes the app pictures in `docs/assets/app/` from the
  design's sample app. A later design replaced its buttons and its Pricing page and added the
  Get started window; `tools/capture_start.cjs` makes that window's pictures and textures in
  `docs/assets/start/`. Neither design's prototype is kept in this repository.
- `design_handoff_site/` is the earlier site's handoff, kept for reference.

## The design system, in two folders

- `design-system/` — the seed. The product's own tokens, copied verbatim
  from its stylesheet on 2026-09-24, plus static renditions of its
  components and the brand book. This is what Claude Design read to
  create the Civium Design System project. It changes only when the
  product's stylesheet changes.
- `.claude/skills/civium-design/` — the current design system as Claude
  Design exports it (a skill: `SKILL.md`, `README.md`, `styles.css`,
  `tokens/`, `components/`, `guidelines/`, `ui_kits/`). This is what the
  site is built from. When the design changes in Claude Design, the new
  export replaces this folder, dated in the commit.

The `ui_kits/product/` composition inside the export is a stand-in made
from the components alone, not the product's real screens.
