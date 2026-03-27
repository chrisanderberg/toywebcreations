# REQUIREMENTS.md

## Purpose
This file tracks the active implementation contract for ToyWebCreations. It
captures the requirements that should guide implementation and review.

## How to interpret this file
- Hard requirements are mandatory. Agents must not violate them unless the
  human explicitly changes or approves an exception.
- Soft requirements are recommended defaults. Agents should follow them unless
  there is a clear, task-specific reason not to.
- Human approval is required before adding, removing, or changing a hard
  requirement.

## Hard requirements
- The site shall be implemented as a static Astro site.
- The hosting target shall be GitHub Pages.
- The site shall not require a backend, authentication, accounts, or cloud sync
  for core functionality.
- The home page shall be the project index, and there shall be no separate
  `/projects/` route in the core site structure.
- The site shall support these route patterns:
  `/`, `/about/`, `/<slug>/`, and `/<slug>/about/`.
- Every page shall include a consistent top header with:
  - the ToyWebCreations banner linking to Home
  - an explicit `Home` link
  - an explicit `About` link
  - a `GitHub` link
- On the home page, the `GitHub` link shall point to the repo root.
- On project pages, the `GitHub` link shall point to that project's
  subdirectory in the repo.
- Each project shall have a playable page at `/<slug>/` and an About page at
  `/<slug>/about/`.
- Each project shall be represented in the project registry or metadata source.
- Project pages shall link clearly to their About pages.
- The home page shall include these sections in this order:
  site intro, featured projects, and all projects.
- The site shall remain understandable across themes and pages as one coherent
  site family.

## Soft requirements
- Prefer a cool, memorable experience over sterile portfolio conventions, while
  keeping the site simple and performant.
- Preserve the default site identity as dark, phosphor, CRT-influenced, and
  retro-terminal-inspired without turning the site into a literal terminal
  emulator.
- Preserve clear cross-site continuity even when individual projects diverge
  visually.
- The header should remain structurally familiar across pages and themes, even
  if colors or styling adapt per project.
- The home page should communicate quickly that the site is a collection of
  interactive toy projects meant to be tried quickly.
- Featured projects should feel visually richer than the all-projects list and
  make cover images the main attraction.
- All-project list items should stay compact, scannable, and intentional rather
  than overly theatrical.
- About pages should be visually simpler than demo pages and prioritize
  readability and easy navigation.
- Do not turn the site into one giant SPA that ships all project code at once.
- Keep project-specific dependencies route-local whenever possible.
- Load heavier dependencies only on the relevant project routes.
- Prefer home-page rendering from lightweight project metadata rather than
  eager imports of every project implementation.
- Keep interactive demos obvious quickly on project pages instead of hiding
  them behind long preambles.
- Prefer local-only persistence when persistence improves UX, and do not make
  persistence required for basic use.
- Default to no audio. If a project benefits materially from audio, provide
  obvious mute or volume controls.
- Do not add a blog or notes section in the MVP shape of the site.
- Do not add analytics or tracking by default.
- No public email link is required by default.
- Use glow strategically rather than making every element glow equally.
  Rationale: glow is part of the brand, but overuse harms legibility and visual
  hierarchy.
- Keep CRT or scanline texture subtle enough that text remains readable and the
  page does not feel noisy.
  Rationale: the effect should support the vibe rather than overwhelm the
  content.
- Typography should feel slightly retro-technical, but body text should
  prioritize readability and should not default to monospaced text everywhere.
- Preserve readability over aesthetic purity when the two are in tension.
- Interactive elements should look interactive through clear hover, focus, and
  active states rather than relying only on subtle color shifts.
- Motion should be restrained and should not delay interaction or make the site
  feel sluggish.
- Copy should feel direct, approachable, mildly playful, and technically
  literate without showing off.
- For project About pages, explain concepts at a beginner-friendly level first,
  then go deeper technically where useful.
- Avoid jargon-first explanations, faux-terminal roleplay, and overly
  self-serious language.
- Maintain readable contrast and visible focus states across the site.
- Ensure the header remains usable on small screens and important actions remain
  easy to tap.

## Implementation structure
- Prefer one Astro app at the repo root unless the project grows enough that a
  multi-package structure is clearly justified.
- Keep a shared site shell for layout, header, navigation, and common styling.
- Use a central project registry for homepage rendering and route generation.
- Prefer per-project modules that own their own interactive implementation and
  About content.
- Keep route-level code separation so each project loads only what it needs.
- Prefer a repository shape roughly like:
  - `AGENTS.md`, `PROJECT.md`, `REQUIREMENTS.md`
  - `public/` for shared public assets
  - `src/components/` for shared site and page components
  - `src/layouts/` for site and project layouts
  - `src/lib/projects/` for project registry and shared project types
  - `src/pages/` for top-level and slug-based routes
  - `src/projects/<slug>/` for project-specific code and content
  - `src/styles/` for global and theme styles
- If project-specific logic grows large enough, split it into focused modules
  inside the relevant `src/projects/<slug>/` directory rather than pushing it
  into a global site-wide bundle.

## Candidate promotions to hard requirements
- None yet.

## Open questions
- None yet.
