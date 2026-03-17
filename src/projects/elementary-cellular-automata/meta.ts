import { getProjectSourceUrl } from "../../lib/github";
import type { ProjectMeta } from "../../lib/projects/types";

export const meta = {
  slug: "elementary-cellular-automata",
  title: "1D Cellular Automata Explorer",
  description: "Explore all 256 elementary cellular automata rules with phosphor-rendered patterns and seed controls.",
  featured: true,
  coverImage: "images/projects/elementary-cellular-automata/cover.svg",
  icon: "images/projects/elementary-cellular-automata/icon.svg",
  sourceLink: getProjectSourceUrl("elementary-cellular-automata"),
  eyebrow: "Pattern machine"
} satisfies ProjectMeta;
