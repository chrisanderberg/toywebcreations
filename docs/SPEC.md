# ToyWebCreations Spec

## 1. Overview
ToyWebCreations is a static portfolio site for small interactive web projects:
puzzles, simulations, generators, visual experiments, and other focused toy-like
experiences.

Current MVP projects:
- Sudoku
- Conway's Game of Life
- 1D Cellular Automata Explorer
- Tower of Hanoi

The site is not a blog. It is a hub for playable demos, plus a short About page
for the site itself and a short About page for each individual project.

Deployed to GitHub Pages. Site URL derived from `GITHUB_OWNER` in `src/lib/site.ts`.

## 2. Purpose
ToyWebCreations exists to:
- consolidate one-off projects into a coherent portfolio,
- create a memorable public-facing showcase for hiring,
- make it easy to browse and try demos quickly,
- capture a "learning log" spirit through per-project writeups instead of a blog.

## 3. Audience
The site serves two main audiences:

### Hiring managers
They should be able to:
- understand what the site is quickly,
- browse projects without friction,
- get a strong impression from the presentation,
- click into something playable immediately.

### Developers
They should be able to:
- understand the concept behind each project,
- read beginner-friendly explanations,
- find deeper implementation notes where useful,
- locate the source code easily.

## 4. Priorities
When making tradeoffs, prioritize:
1. Cool factor
2. Simplicity
3. Performance and polish sufficient to avoid being "shit"

Minor bugs are acceptable for MVP if the overall experience is coherent and
memorable.

## 5. Non-goals
For MVP, ToyWebCreations does not include:
- accounts or authentication,
- backend services required for core functionality,
- cloud sync,
- a blog or notes section,
- default analytics or tracking,
- an expectation that every project is a one-day build.

## 6. Information architecture

### 6.1 Routes
The site includes these route patterns:
- `/` — home page / project index
- `/about/` — about the site
- `/<project-slug>/` — project page
- `/<project-slug>/about/` — project About page

There is no separate `/projects/` route in MVP.

### 6.2 Global header/navigation
Every page must include:
- a ToyWebCreations banner linking to Home,
- an explicit `Home` link,
- an explicit `About` link,
- a `GitHub` link.

GitHub link behavior:
- On the home page, the GitHub link points to the repo root.
- On a project page, the GitHub link points to that project's subdirectory in
  the monorepo.

No public email link is required.

## 7. Homepage requirements

### 7.1 Sections
The home page must contain these sections in this order:
1. Site intro
2. Featured projects
3. All projects

### 7.2 Site intro
The home page should explain, briefly and clearly:
- what ToyWebCreations is,
- what kind of projects live here,
- why the site exists.

### 7.3 Featured projects
Featured projects should appear in a visually stronger grid section.

Each featured item should include:
- cover image,
- title,
- optionally a one-line description.

The primary click target should navigate to `/<slug>/`.

### 7.4 All projects
All projects should appear in a simpler, more compact list.

Each list item should include:
- small icon/image,
- title,
- optionally a short description.

No filters, tags, or categories are required for MVP.

## 8. Project pages

### 8.1 General expectations
Project pages should:
- make the interactive demo obvious without hunting,
- provide a clear link to `/<slug>/about/`,
- provide a GitHub link to the project's source subdirectory,
- work without requiring persistence.

### 8.2 Template flexibility
There is no mandatory project page template beyond the shared global header and
navigation. Individual projects may choose layouts and interaction patterns that
best suit the project.

### 8.3 Persistence and ephemerality
Default behavior:
- projects should work without any saved state.

Optional behavior:
- lightweight local-only persistence may be used for things like settings,
  seeds, or preferences if it improves UX.

Persistence must not be required for basic use.

### 8.4 Audio policy
Default:
- no audio.

Exception:
- game-like projects may include audio if audio materially improves the
  experience.
- If audio exists, the page must provide obvious mute and/or volume controls.

## 9. Per-project About pages

### 9.1 Route
- `/<slug>/about/`

### 9.2 Purpose
Each project About page should briefly explain:
- what the project is,
- what concept it demonstrates,
- beginner-friendly explanation of the concept,
- implementation notes,
- link to source.

These writeups do not need to be long-form essays.

## 10. Visual/theming requirements

### 10.1 Default site aesthetic
The default site aesthetic is:
- dark,
- green phosphor / CRT / retro-terminal inspired,
- glowy,
- scanline-inflected,
- visually distinctive.

The site should not be a literal terminal emulator. It is a modern portfolio
with a retro skin.

### 10.2 Per-project theming
Projects may diverge from the default theme where appropriate. Some projects
will benefit from their own visual identity.

There is no theme toggle in MVP. Theme is per page / per project.

### 10.3 Cross-theme continuity
Even when a project diverges visually:
- the ToyWebCreations header must remain present,
- the header structure and layout should remain familiar,
- users should still clearly understand they are on the same site.

## 11. Content model
The homepage should be driven by a minimal project registry.

Each project entry must support:
- `slug`
- `title`
- `description`
- `featured`
- `coverImage`
- `sourceLink`

Usage:
- featured grid uses `coverImage`, `title`, and optionally `description`
- all-projects list uses a small image/icon, `title`, and optionally
  `description`

MVP does not require:
- tags,
- status badges,
- tech badges,
- time spent,
- last updated.

## 12. Technical constraints
These are product-level technical constraints because they affect the shipped
experience.

- Hosting target: GitHub Pages
- Static output preferred
- Framework: Astro
- No backend required for core functionality
- All project computation should run locally in the browser
- Any persistence should remain local-only
- Project-specific dependencies must not be shipped site-wide by default

## 13. Analytics/tracking
- No tracking by default
- If analytics are added later, they must be minimal and justified

## 14. MVP release definition
MVP is good enough to ship publicly when:
- the home page exists with intro, featured projects, and all projects list,
- the site About page exists,
- at least 2 project pages exist and are playable,
- each of those projects has a project About page,
- header links are present and consistent across pages,
- the site feels lightweight and memorable.

## 15. Tone constraints
- "retro" and "terminal" are acceptable descriptors
- avoid "hacker" terminology in site voice and branding
