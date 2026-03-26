# ToyWebCreations Architecture

## 1. Purpose
This document describes how ToyWebCreations is structured and implemented.

`docs/SPEC.md` defines what the site must do.
This document defines how the codebase should be organized to support that.

## 2. Core architectural decisions
- Framework: Astro
- Integrations: `@astrojs/react` for interactive project demos (islands), `@astrojs/mdx` for project About pages
- Deployment target: GitHub Pages (see `site` + `base` in `astro.config.mjs` for project-site URLs)
- Rendering target: static output
- Runtime model: no backend required for core functionality
- Site shell: shared Astro layouts/components
- Project implementations: route-local client-side code as needed
- Performance rule: do not bundle all project code into a single site-wide app

## 3. High-level approach
ToyWebCreations is a static Astro site with:
- a shared site shell for layout, header, navigation, and common styling,
- a central project registry for homepage rendering and route generation,
- per-project modules that own their own interactive implementation,
- per-project About content,
- route-level code separation so each project loads only what it needs.

## 4. Repository shape

### 4.1 Preferred starting point
Start simple: one Astro app at the repo root.

If the project later grows enough to justify separate packages, introduce them
deliberately. Do not start with extra workspace/package complexity unless there
is a clear need.

### 4.2 Suggested structure
```text
/
├─ AGENTS.md
├─ docs/
│  ├─ SPEC.md
│  ├─ ARCHITECTURE.md
│  └─ DESIGN.md
├─ public/
│  ├─ favicon/
│  └─ images/
│     └─ projects/
│        └─ <slug>/
├─ src/
│  ├─ components/
│  │  ├─ site/
│  │  ├─ home/
│  │  └─ projects/
│  ├─ layouts/
│  │  ├─ SiteLayout.astro
│  │  └─ ProjectLayout.astro
│  ├─ lib/
│  │  ├─ projects/
│  │  │  ├─ registry.ts
│  │  │  └─ types.ts
│  │  └─ github.ts
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ about.astro
│  │  └─ [slug]/
│  │     ├─ index.astro
│  │     └─ about.astro
│  ├─ projects/
│  │  └─ <slug>/
│  │     ├─ Demo.(ts|tsx|astro|vue|svelte)
│  │     ├─ about.mdx
│  │     ├─ meta.ts
│  │     ├─ styles.css
│  │     └─ assets/
│  └─ styles/
│     ├─ global.css
│     ├─ theme.css
│     └─ project-header.css
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json