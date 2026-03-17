import type { ProjectAboutContent } from "../../lib/projects/types";

export const about: ProjectAboutContent = {
  intro:
    "This project turns a familiar number puzzle into a clear practice surface with enough feedback to keep mistakes visible without solving the board for you.",
  sections: [
    {
      title: "What It Is",
      body: [
        "Sudoku is a 9 by 9 grid divided into smaller 3 by 3 boxes. The goal is to fill every empty square with a number from 1 to 9 so that each row, column, and box uses each number exactly once.",
        "This demo starts from a fixed puzzle so the interaction can focus on entry, validation, and note-taking instead of puzzle generation."
      ]
    },
    {
      title: "Beginner-Friendly Concept",
      body: [
        "The heart of Sudoku is constraint checking. Every number you place reduces the legal options around it, and every contradiction tells you something is wrong.",
        "Pencil marks are useful because they let you track possible values in a square before committing. That makes the puzzle feel less like guessing and more like narrowing down possibilities."
      ]
    },
    {
      title: "Implementation Notes",
      body: [
        "The board is stored as a simple array of cell records. On each edit, the demo recomputes row, column, and box conflicts so invalid entries can be highlighted immediately.",
        "Notes are local to each editable cell, and the completion check only succeeds when the board is full and no conflicts remain."
      ]
    }
  ]
};
