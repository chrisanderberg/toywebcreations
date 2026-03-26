import type { ProjectMeta } from "../../lib/projects/types";
import { projectSourceUrl } from "../../lib/github";

export const meta: ProjectMeta = {
  slug: "tower-of-hanoi",
  title: "Tower of Hanoi",
  description: "Move the stack legally—or watch an optimal auto-solve unfold.",
  featured: false,
  coverImage: "images/projects/tower-of-hanoi/cover.svg",
  icon: "images/projects/tower-of-hanoi/icon.svg",
  sourceLink: projectSourceUrl("tower-of-hanoi")
};
