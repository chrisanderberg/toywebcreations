import type { ProjectAboutContent } from "../../lib/projects/types";

export const about: ProjectAboutContent = {
  intro:
    "This project turns the classic Tower of Hanoi into a playable puzzle table with a visible optimal-move target and a built-in recursive replay.",
  sections: [
    {
      title: "What It Is",
      body: [
        "Tower of Hanoi uses three pegs and a stack of discs that start on one side. The goal is to move the full stack to the far peg without ever placing a larger disc on top of a smaller one.",
        "Only the top disc of any peg can move, so even a small stack quickly turns into a puzzle about planning ahead."
      ]
    },
    {
      title: "Beginner-Friendly Concept",
      body: [
        "The puzzle is a clean example of recursion. To move a big disc, you first have to temporarily move every smaller disc out of the way, then move the big disc, then rebuild the smaller stack on top of it.",
        "That repeating structure is why the optimal move count is always 2^n - 1. Each additional disc doubles the work from the previous puzzle, then adds one more move for the largest disc."
      ]
    },
    {
      title: "Implementation Notes",
      body: [
        "The demo stores the board as three arrays and applies one legal move at a time. Manual play uses a simple two-click interaction: select a source peg, then choose a destination peg.",
        "The auto-solver generates the classic optimal move list recursively and replays it step by step so the same logic that proves the solution also drives the animation."
      ]
    }
  ]
};
