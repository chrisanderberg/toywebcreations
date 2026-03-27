# PROJECT.md

## Overview
ToyWebCreations is a static portfolio site for small interactive web projects:
puzzles, simulations, generators, visual experiments, and other focused
toy-like experiences. It is a hub for playable demos, a short About page for
the site itself, and a short About page for each individual project.

The site is not a blog, not a general-purpose app platform, and not a content
feed. It exists to let visitors browse, try, and understand playful web
projects quickly.

Primary domain: `https://toywebcreations.dev`

## Purpose
ToyWebCreations exists to:
- consolidate one-off projects into a coherent portfolio
- create a memorable public-facing showcase for hiring
- make it easy to browse and try demos quickly
- preserve a "learning log" spirit through per-project writeups instead of a
  separate blog

## Audience
The site serves two main audiences:

- Hiring managers who should be able to understand what the site is quickly,
  browse projects without friction, get a strong first impression, and click
  into something playable immediately.
- Developers who should be able to understand the concept behind each project,
  read beginner-friendly explanations, find deeper implementation notes where
  useful, and locate the source code easily.

## Priorities
When making tradeoffs, prioritize:
1. Cool factor
2. Simplicity
3. Performance and polish sufficient to avoid feeling sloppy

Minor bugs are acceptable for MVP if the overall experience is coherent and
memorable.

## Non-goals
For MVP, ToyWebCreations does not include:
- accounts or authentication
- backend services required for core functionality
- cloud sync
- a blog or notes section
- default analytics or tracking
- an expectation that every project is a one-day build

## Information architecture

### Routes
The core site includes these route patterns:
- `/` for the home page and project index
- `/about/` for the site About page
- `/<project-slug>/` for a project page
- `/<project-slug>/about/` for a project About page

There is no separate `/projects/` route in MVP.

### Homepage shape
The home page should contain these sections in this order:
1. Site intro
2. Featured projects
3. All projects

The site intro should explain briefly and clearly:
- what ToyWebCreations is
- what kind of projects live here
- why the site exists

Featured projects should appear in a visually stronger grid. All projects
should also appear in a simpler, more compact list for breadth.

## Project pages
Project pages should:
- make the interactive demo obvious without hunting
- provide a clear link to `/<slug>/about/`
- provide a GitHub link to the project's source subdirectory
- work without requiring persistence

There is no mandatory per-project page template beyond the shared global
header/navigation. Individual projects may choose layouts and interaction
patterns that best suit the project.

## Project About pages
Each project should have an About page at `/<slug>/about/` that briefly
explains:
- what the project is
- what concept it demonstrates
- a beginner-friendly explanation of the concept
- implementation notes
- a source link

These writeups should stay concise rather than turning into essays.

## Content model
The home page should be driven by a minimal project registry.

Each project entry must support:
- `slug`
- `title`
- `description`
- `featured`
- `coverImage`
- `icon`
- `sourceLink`

`coverImage` and `icon` are distinct assets:
- `coverImage` is for featured presentation
- `icon` is for compact list rows

MVP does not require:
- tags
- status badges
- tech badges
- time spent
- last updated

## Product character
The site should feel:
- playful
- memorable
- a little weird in a good way
- retro without cosplay
- technical without hostility
- polished enough to feel intentional, not corporate

The default identity is dark, phosphor, CRT-influenced, and retro-terminal
inspired, but it should not become a literal terminal emulator. It is a modern
portfolio site with a distinct visual skin.

Projects may diverge visually when needed, but users should still recognize
them as part of the same site family.

## Current document model
- `AGENTS.md` defines how agents should work in this repo.
- `PROJECT.md` defines the product, goals, audience, and information
  architecture.
- `REQUIREMENTS.md` defines the active implementation contract, including
  design and implementation-structure requirements.

## How to use this file
- Read this file first to understand what the product is, who it serves, and
  what shape it should have.
- Read `REQUIREMENTS.md` next for the active implementation contract.

## Scope guidance
- Treat `PROJECT.md` as the place for stable project description, goals, scope,
  and product shape.
- Do not turn this file into a changelog, scratchpad, or task plan.
