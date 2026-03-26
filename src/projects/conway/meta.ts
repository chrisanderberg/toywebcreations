import type { ProjectMeta } from "../../lib/projects/types";
import { projectSourceUrl } from "../../lib/github";

export const meta: ProjectMeta = {
  slug: "conway",
  title: "Conway's Game of Life",
  description: "Cellular automaton on a torus—run, pause, and paint your own seeds.",
  featured: true,
  coverImage: "images/projects/conway/cover.svg",
  icon: "images/projects/conway/icon.svg",
  sourceLink: projectSourceUrl("conway")
};
