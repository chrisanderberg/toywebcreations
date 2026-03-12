# AGENTS.md

## Purpose
- Durable repo-specific guidance for coding agents.
- Keep this file minimal.
- Prefer linking to authoritative docs over duplicating detail here.

## Source of truth
- Product/spec: `docs/SPEC.md`
- Implementation structure: `docs/ARCHITECTURE.md`
- Visual/design guidance: `docs/DESIGN.md`

If these docs conflict:
1. direct user instructions win
2. `docs/SPEC.md` governs user-visible behavior and scope
3. `docs/ARCHITECTURE.md` governs implementation structure
4. `docs/DESIGN.md` governs visual consistency and theming

## Project constraints
- Framework: Astro
- Hosting target: GitHub Pages
- Static site only
- No backend, auth, accounts, or cloud sync for core functionality
- Home page is the project index; there is no separate `/projects/` page
- Site routes:
  - `/`
  - `/about/`
  - `/<slug>/`
  - `/<slug>/about/`

## Global UX requirements
Every page must include a consistent top header with:
- ToyWebCreations banner linking to Home
- explicit `Home` link
- explicit `About` link
- `GitHub` link

GitHub link behavior:
- Home page: repo root
- Project pages: that project's subdirectory in the repo

## Performance constraints
- Do not turn the site into one giant SPA that ships all project code at once.
- Project-specific dependencies must remain route-local.
- Heavier dependencies should load only on the relevant project route.
- The home page should render from lightweight project metadata, not from eager
  imports of every project implementation.

## Content conventions
- Each project must have:
  - a playable page at `/<slug>/`
  - an About page at `/<slug>/about/`
- Each project must be represented in the project registry/metadata source.
- Each project page should link clearly to its About page.
- Per-project writeups should explain the concept in beginner-friendly terms,
  with deeper implementation notes where useful.

## Product boundaries
- No blog/notes section in MVP
- No default analytics/tracking
- No public email link requirement
- Persistence, if used, should remain local-only
- Default stance is no audio; exceptions are allowed for specific game-like
  projects if obvious mute/volume controls are provided

## Documentation maintenance
- Update `docs/SPEC.md` when user-visible behavior or scope changes.
- Update `docs/ARCHITECTURE.md` when implementation structure or technical
  assumptions change.
- Update `docs/DESIGN.md` when visual system or theming rules change.
- Add assumptions only when they materially affect implementation or review.