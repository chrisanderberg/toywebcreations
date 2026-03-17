import { getProjectSourceUrl } from "../../lib/github";
import type { ProjectMeta } from "../../lib/projects/types";

export const meta = {
  slug: "conway",
  title: "Conway's Game of Life",
  description: "A playable Game of Life board with presets, speed control, and click-to-draw editing.",
  featured: true,
  coverImage: "images/projects/conway/cover.svg",
  icon: "images/projects/conway/icon.svg",
  sourceLink: getProjectSourceUrl("conway"),
  eyebrow: "Cellular automaton"
} satisfies ProjectMeta;
