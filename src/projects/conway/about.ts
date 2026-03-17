import type { ProjectAboutContent } from "../../lib/projects/types";

export const about: ProjectAboutContent = {
  intro:
    "This project is a playable version of Conway's Game of Life, where simple neighborhood rules produce moving structures, oscillators, and sudden collapses.",
  sections: [
    {
      title: "What It Is",
      body: [
        "Game of Life is a cellular automaton. You start with a grid of live and dead cells, then advance the simulation in steps.",
        "Each cell looks at its eight neighbors. Too few neighbors and it dies. Too many neighbors and it dies. Exactly three neighbors brings a dead cell to life, while two or three lets a live cell survive."
      ]
    },
    {
      title: "Beginner-Friendly Concept",
      body: [
        "What makes the system interesting is emergence. The rules are tiny, but the results can look surprisingly complex because every generation changes the next one.",
        "Drawing a few cells by hand is enough to see stable blocks, blinking oscillators, and gliders that appear to move across the board."
      ]
    },
    {
      title: "Implementation Notes",
      body: [
        "The demo keeps the grid in React state and computes each new generation by counting live neighbors for every cell in the current frame.",
        "A short interval drives playback, while presets and drawing tools make it easy to seed the board without introducing any backend or persistence requirement."
      ]
    }
  ]
};
