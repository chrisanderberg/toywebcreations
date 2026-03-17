import type { ProjectAboutContent } from "../../lib/projects/types";

export const about: ProjectAboutContent = {
  intro:
    "This project explores elementary one-dimensional cellular automata, where each new row is produced from the three-cell neighborhoods in the row above it.",
  sections: [
    {
      title: "What It Is",
      body: [
        "A one-dimensional cellular automaton is a line of cells that evolves one row at a time. Each cell is either on or off, and the next row is computed by applying the same tiny rule to every three-cell neighborhood.",
        "Instead of watching a two-dimensional grid update in place, you stack each new row underneath the previous one. That turns the history of the system into a picture."
      ]
    },
    {
      title: "Why There Are 256 Rules",
      body: [
        "A cell only inspects three inputs: left, center, and right. That gives eight possible neighborhoods, from 111 down to 000.",
        "Each of those eight neighborhoods can map to either 0 or 1 in the next row. Eight independent yes-or-no choices means 2^8 possible rules, which is 256 total."
      ]
    },
    {
      title: "What The Rule Number Means",
      body: [
        "The rule number is just an eight-bit pattern. Each bit says whether one of the eight neighborhoods should produce a live cell.",
        "That is why rule displays are often shown as a lookup table. A neighborhood like 101 checks one bit, while 010 checks another. Changing a single bit can radically change the pattern."
      ]
    },
    {
      title: "Pattern Behavior",
      body: [
        "Some rules die out quickly. Some repeat into regular ladders or diamonds. Others generate noisy, chaotic textures, and a few sit in the interesting middle ground where ordered structures and disruption coexist.",
        "Rules such as 30, 90, 110, and 184 are popular because they each highlight a different flavor of behavior."
      ]
    },
    {
      title: "Implementation Notes",
      body: [
        "The demo treats cells outside the current row as fixed zeros, which keeps the edge behavior simple and makes the triangular silhouettes easier to read.",
        "Rendering happens on a canvas so each cell can stay crisp and lightweight even when the viewport contains hundreds of rows. The rule math lives in a small utility module that converts the rule number into neighborhood outputs and generates the full stacked pattern in memory."
      ]
    }
  ]
};

