import type { ProjectMeta } from "../../lib/projects/types";
import { projectSourceUrl } from "../../lib/github";

export const meta: ProjectMeta = {
  slug: "sudoku",
  title: "Sudoku",
  description: "Classic 9×9 grid with conflict hints—play in the browser.",
  featured: true,
  coverImage: "images/projects/sudoku/cover.svg",
  icon: "images/projects/sudoku/icon.svg",
  sourceLink: projectSourceUrl("sudoku")
};
