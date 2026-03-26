/** Neighborhood bit pattern: (left<<2)|(self<<1)|right, range 0..7 (000..111). */
export function neighborhoodIndex(left: number, self: number, right: number): number {
  return (left << 2) | (self << 1) | right;
}

/** Output bit for one neighborhood under Wolfram rule 0..255. */
export function ruleOutput(rule: number, neighborhood: number): number {
  return (rule >> neighborhood) & 1;
}

/** All eight [neighborhood, output] pairs for UI (7 down to 0). */
export function ruleToMapping(rule: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let n = 7; n >= 0; n--) {
    pairs.push([n, ruleOutput(rule, n)]);
  }
  return pairs;
}

function getCell(row: number[], i: number): number {
  if (i < 0 || i >= row.length) return 0;
  return row[i]!;
}

/** Next generation with fixed-zero outside the row. */
export function evolveRow(row: number[], rule: number): number[] {
  const w = row.length;
  const next = new Array<number>(w);
  for (let i = 0; i < w; i++) {
    const left = getCell(row, i - 1);
    const self = getCell(row, i);
    const right = getCell(row, i + 1);
    const idx = neighborhoodIndex(left, self, right);
    next[i] = ruleOutput(rule, idx);
  }
  return next;
}

export function generatePattern(initialRow: number[], rule: number, numRows: number): number[][] {
  const rows: number[][] = [initialRow.slice()];
  let cur = initialRow;
  for (let r = 1; r < numRows; r++) {
    cur = evolveRow(cur, rule);
    rows.push(cur);
  }
  return rows;
}

export function createCenteredSeed(width: number): number[] {
  const row = new Array<number>(width).fill(0);
  row[Math.floor(width / 2)] = 1;
  return row;
}

export function createRandomSeed(width: number, density = 0.35): number[] {
  return Array.from({ length: width }, () => (Math.random() < density ? 1 : 0));
}
