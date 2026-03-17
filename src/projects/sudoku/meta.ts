import { getProjectSourceUrl } from "../../lib/github";
import type { ProjectMeta } from "../../lib/projects/types";

export const meta = {
  slug: "sudoku",
  title: "Sudoku",
  description: "A playable Sudoku board with pencil marks, conflict detection, and a built-in win check.",
  featured: true,
  coverImage: "images/projects/sudoku/cover.svg",
  icon: "images/projects/sudoku/icon.svg",
  sourceLink: getProjectSourceUrl("sudoku"),
  eyebrow: "Logic puzzle"
} satisfies ProjectMeta;
