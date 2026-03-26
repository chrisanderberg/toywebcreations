# ToyWebCreations

Static Astro portfolio for small interactive web projects (puzzles, simulations, experiments). See `docs/SPEC.md` for product scope and `docs/ARCHITECTURE.md` for layout.

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Local dev server (default `localhost:4321`) |
| `npm run build`   | Production build to `dist/`                 |
| `npm run preview` | Preview the production build                |

## Configuration

- **`astro.config.mjs`**: `site` and `base` (`/toywebcreations/`) for GitHub Pages project sites. Adjust `base` if the repo name or custom domain setup changes.
- **`src/lib/github.ts`**: GitHub owner, repo, and branch for header links and `sourceLink` in project metadata.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys `dist/` with the official Pages actions. Enable **GitHub Pages** with the **GitHub Actions** source in repository settings.

## Dev server: `Cannot read properties of undefined (reading 'call')`

That overlay usually comes from a **Vite + React plugin race** after a config change, dependency install, or bad cache ([vitejs/vite#21162](https://github.com/vitejs/vite/issues/21162)). This repo configures React so the plugin does not drop its `transform` hook when Babel looks “skippable.” If it still happens: stop the dev server, run **`npm run dev:clean`** (clears `node_modules/.vite` and `.astro`), then open the site again. Avoid running `npm install` while `astro dev` is still running.
