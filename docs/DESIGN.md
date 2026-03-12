DESIGN.md

```md
# ToyWebCreations Design

## 1. Purpose
This document defines the visual language, brand feel, and UI consistency rules
for ToyWebCreations.

`docs/SPEC.md` defines what the site should do.
This document defines how the site should look and feel.

## 2. Brand and aesthetic direction

### 2.1 Core vibe
ToyWebCreations should feel:
- playful
- memorable
- a little weird in a good way
- retro without being cosplay
- technical without being hostile
- polished enough to feel intentional, not corporate

### 2.2 Main visual identity
The default site identity is:
- dark background
- green phosphor glow
- CRT/scanline influence
- retro terminal flavor
- modern layout structure underneath

This is not a literal terminal emulator UI. The site should feel like a
portfolio site wearing a phosphor skin, not a fake shell prompt.

### 2.3 Tone constraints
Preferred descriptors:
- retro
- terminal
- phosphor
- CRT
- glow

Avoid:
- "hacker"
- edgy security-culture phrasing
- anything that makes the site feel gimmicky or try-hard

## 3. Design principles
Use these principles when design decisions are unclear:

1. Make an impression quickly.
2. Make it obvious what is clickable and playable.
3. Preserve readability over aesthetic purity.
4. Let projects have personality without losing site identity.
5. Keep the UI simpler than the visual treatment.

## 4. Shared site identity

### 4.1 Header invariants
Across all pages and themes, the header must remain structurally familiar.

Required header elements:
- ToyWebCreations banner/logo text
- `Home`
- `About`
- `GitHub`

The exact colors/styling may adapt per project, but:
- layout should remain consistent,
- header height should remain broadly consistent,
- the user should immediately recognize it as the same site.

### 4.2 Home page identity
The home page should communicate:
- this is a collection of interactive toy projects,
- the projects are meant to be tried quickly,
- the site has a distinct identity beyond being a generic portfolio.

## 5. Default theme

### 5.1 Color direction
Default palette:
- near-black or very dark background
- phosphor green as the primary accent
- softer green variants for hierarchy
- restrained use of white/gray for text contrast and readability

General guidance:
- avoid neon overload everywhere,
- use bright glow strategically for emphasis,
- maintain enough contrast to keep text comfortable to read.

### 5.2 Glow
Glow is part of the brand, but should be controlled.

Use glow to emphasize:
- headers
- active states
- key cards or hero elements
- interactive surfaces when appropriate

Avoid:
- making every element glow equally,
- heavy blur that harms legibility,
- glow so strong it obscures edges or text.

### 5.3 Scanlines / CRT texture
CRT-inspired texture is encouraged, but should be subtle enough that:
- text remains readable,
- the page does not feel noisy,
- the effect supports the vibe instead of overwhelming the content.

Think "ambient texture," not "novelty filter."

## 6. Typography
Typography should feel:
- crisp
- readable
- slightly retro-technical
- modern enough for comfortable reading

Guidelines:
- reserve obviously terminal-style type for accents, labels, or headings if used
- body text should prioritize readability
- do not force monospaced text everywhere
- maintain a clear hierarchy between headings, labels, and body copy

## 7. Layout

### 7.1 General layout behavior
The layout should be modern and clean beneath the retro styling:
- clear sections
- obvious spacing
- simple navigation
- readable line lengths
- no clutter for the sake of theme

### 7.2 Home page section rhythm
The home page should flow in this order:
1. Intro / identity
2. Featured projects
3. All projects

Each section should be visually distinct without feeling like an unrelated page.

### 7.3 Content density
Prefer:
- medium density
- enough breathing room to let visuals land
- compact enough that browsing feels quick

Avoid:
- giant empty landing-page fluff,
- walls of text,
- over-dense dashboard layouts.

## 8. Components

### 8.1 Featured project cards
Featured cards should:
- feel visually richer than the all-projects list,
- make the cover image the main attraction,
- show title clearly,
- optionally show a short description,
- clearly indicate clickability.

Good traits:
- strong hover/focus state
- image-led composition
- title readable at a glance

Avoid:
- metadata clutter
- too many badges
- tiny unreadable text embedded in the image

### 8.2 All-project list items
All-project items should:
- be compact,
- scan quickly,
- still feel intentional,
- include a small image/icon plus title,
- optionally include a short description.

This section is for breadth, not theatrics.

### 8.3 About pages
About pages should be visually simpler than demo pages.
They should prioritize:
- readability
- clarity
- lightweight structure
- easy navigation back to the project/demo

## 9. Interaction design

### 9.1 Clickability
Interactive elements should look interactive.
Do not rely only on color shifts that are too subtle to notice.

Use clear:
- hover states
- focus states
- pressed/active states where relevant

### 9.2 Motion
Motion is allowed and can strengthen the site's personality, but should be used
with restraint.

Good uses:
- subtle hover transitions
- restrained loading/reveal motion
- small ambient effects

Avoid:
- constant movement everywhere,
- motion that delays interaction,
- effects that make the site feel sluggish.

### 9.3 Project demo prominence
On project pages, the interactive demo should be obvious quickly.
The page should not make users read a long preamble before they can interact.

## 10. Per-project theming

### 10.1 Freedom
Projects may diverge from the default phosphor theme if the project benefits
from a different visual language.

Examples:
- color-heavy generators
- playful simulation pages
- project-specific game aesthetics

### 10.2 Boundaries
Even when diverging:
- the ToyWebCreations header remains present,
- header structure stays familiar,
- the page should still feel like part of the same site family.

### 10.3 Recommendation
Think of the site as a brand with project-specific album covers:
- the frame is recognizable,
- the contents can vary.

## 11. Imagery

### 11.1 Cover images
Project cover images should:
- communicate the project quickly,
- be visually distinctive,
- work at homepage card size,
- avoid relying on tiny text for meaning.

### 11.2 Small icons/images
List icons can be simpler and more utilitarian, but should still feel coherent
with the project identity.

## 12. Writing and voice
Copy should feel:
- direct
- approachable
- mildly playful
- technically literate without showing off

For project About pages:
- explain concepts at a beginner-friendly level first,
- then go deeper technically if useful.

Avoid:
- jargon-first explanations,
- faux-terminal roleplay,
- overly self-serious language.

## 13. Accessibility and readability
The retro aesthetic must not compromise usability.

Requirements:
- maintain readable contrast
- keep text legible despite glow/texture
- provide visible focus states
- avoid hiding essential information inside decorative effects
- ensure nav remains understandable across themes

For audio-enabled game pages:
- controls for mute/volume must be obvious

## 14. Responsive behavior
The site should ideally work on both desktop and mobile.

Design implications:
- header must remain usable on small screens,
- cards/lists should stack cleanly,
- important actions should remain easy to tap,
- decorative effects should not create mobile performance problems.

## 15. Design system maturity
This is a lightweight design document, not a full formal design system.

Document reusable rules when they become stable:
- header spacing and structure
- card treatments
- section spacing
- color tokens if they become standardized
- typography scales if they become standardized

Until then:
- keep consistency where it matters,
- avoid premature tokenization of everything.

## 16. Change management
Update this document when any of the following change:
- default visual direction
- header consistency rules
- project theming boundaries
- reusable component visual patterns
- tone/wording guidance