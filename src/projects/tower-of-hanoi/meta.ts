import { getProjectSourceUrl } from "../../lib/github";
import type { ProjectMeta } from "../../lib/projects/types";

export const meta: ProjectMeta = {
  slug: "tower-of-hanoi",
  title: "Tower of Hanoi Solver",
  description: "A phosphor-lit Tower of Hanoi puzzle with manual play, move counting, and an animated optimal solver.",
  featured: true,
  coverImage: "images/projects/tower-of-hanoi/cover.svg",
  icon: "images/projects/tower-of-hanoi/icon.svg",
  sourceLink: getProjectSourceUrl("tower-of-hanoi"),
  eyebrow: "Recursive puzzle"
};
