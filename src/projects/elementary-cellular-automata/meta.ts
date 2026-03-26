import type { ProjectMeta } from "../../lib/projects/types";
import { projectSourceUrl } from "../../lib/github";

export const meta: ProjectMeta = {
  slug: "elementary-cellular-automata",
  title: "1D Cellular Automata Explorer",
  description: "Pick any Wolfram rule 0–255 and watch a 1D pattern unfold from a seed row.",
  featured: false,
  coverImage: "images/projects/elementary-cellular-automata/cover.svg",
  icon: "images/projects/elementary-cellular-automata/icon.svg",
  sourceLink: projectSourceUrl("elementary-cellular-automata")
};
