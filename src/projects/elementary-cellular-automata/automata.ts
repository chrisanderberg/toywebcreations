// Elementary 1D Cellular Automata — Core Logic
//
// Each of the 256 elementary rules maps 8 possible 3-cell neighborhoods
// to an output bit. Neighborhood bit index = (left << 2) | (self << 1) | right.
// Rule N: bit `index` of N is the output for neighborhood `index`.
//
// Edge behavior: fixed zeros — cells outside the row boundary are 0.

/** The 8 canonical neighborhood patterns in display order (111 down to 000). */
export const NEIGHBORHOOD_PATTERNS: number[] = [7, 6, 5, 4, 3, 2, 1, 0];

/**
 * Returns the output bit (0 or 1) for a given neighborhood under a rule.
 * neighborhood: integer 0–7 representing (left<<2)|(self<<1)|right
 */
export function ruleOutput(rule: number, neighborhood: number): 0 | 1 {
  return ((rule >> neighborhood) & 1) as 0 | 1;
}

/**
 * Returns an array of [neighborhood, output] pairs for all 8 neighborhoods,
 * in descending order (111 first, 000 last) — useful for the rule display UI.
 */
export function ruleToMapping(rule: number): [number, 0 | 1][] {
  return NEIGHBORHOOD_PATTERNS.map((n) => [n, ruleOutput(rule, n)]);
}

/**
 * Compute the next row from the current row using the given rule.
 * Cells outside the row are treated as 0 (fixed-zero boundary).
 */
export function evolveRow(row: number[], rule: number): number[] {
  const width = row.length;
  return row.map((_, i) => {
    const left = i > 0 ? row[i - 1] : 0;
    const self = row[i];
    const right = i < width - 1 ? row[i + 1] : 0;
    const neighborhood = (left << 2) | (self << 1) | right;
    return ruleOutput(rule, neighborhood);
  });
}

/**
 * Generate a full pattern grid: `numRows` rows starting from `initialRow`.
 * Returns an array of rows (each row is an array of 0s and 1s).
 */
export function generatePattern(
  initialRow: number[],
  rule: number,
  numRows: number
): number[][] {
  const grid: number[][] = [initialRow];
  for (let i = 1; i < numRows; i++) {
    grid.push(evolveRow(grid[i - 1], rule));
  }
  return grid;
}

/** Create a seed row with a single live cell at the center. */
export function createCenteredSeed(width: number): number[] {
  const row = new Array(width).fill(0);
  row[Math.floor(width / 2)] = 1;
  return row;
}

/** Create a seed row with randomly live cells at the given density (0–1). */
export function createRandomSeed(width: number, density = 0.5): number[] {
  return Array.from({ length: width }, () => (Math.random() < density ? 1 : 0));
}

/** Format a neighborhood integer (0–7) as a 3-char binary string, e.g. "101". */
export function neighborhoodLabel(n: number): string {
  return n.toString(2).padStart(3, '0');
}
