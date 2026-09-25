# civiumcre.com

The public marketing site for Civium. GitHub Pages serves the `docs/` folder of
`main`; only what is in `docs/` is published on civiumcre.com.
The product lives in the private repository `ccrouch-cyber/civium` and runs
at app.civiumcre.com; nothing confidential belongs here.

The pages are built from the Civium design system in Claude Design and the
canvas's handoff to Claude Code; see `lab/PORTAL_HANDOFF_T13.md` in the
product repository for the loop. Until the designed pages land, `docs/index.html`
is a holding page in the system's own tokens. The design system and its
export live in the repository for building and are not published pages.

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
