/** Neighborhood bit index: (left<<2)|(self<<1)|right, values 0..7 (000..111). */
const NEIGHBORHOODS = [7, 6, 5, 4, 3, 2, 1, 0] as const;

export function ruleToMapping(rule: number): [number, number][] {
  return NEIGHBORHOODS.map((neighborhood) => [neighborhood, (rule >> neighborhood) & 1]);
}

export function evolveRow(row: number[], rule: number): number[] {
  return row.map((_, i) => {
    const left = row[i - 1] ?? 0;
    const self = row[i];
    const right = row[i + 1] ?? 0;
    const idx = (left << 2) | (self << 1) | right;
    return (rule >> idx) & 1;
  });
}

export function generatePattern(initialRow: number[], rule: number, numRows: number): number[][] {
  const rows: number[][] = [initialRow.slice()];
  for (let r = 1; r < numRows; r++) {
    rows.push(evolveRow(rows[r - 1]!, rule));
  }
  return rows;
}

export function createCenteredSeed(width: number): number[] {
  const row = Array<number>(width).fill(0);
  row[Math.floor(width / 2)] = 1;
  return row;
}

export function createRandomSeed(width: number, density = 0.35): number[] {
  return Array.from({ length: width }, () => (Math.random() < density ? 1 : 0));
}

export function neighborhoodLabel(n: number): string {
  const bits = ['0', '0', '0'];
  for (let b = 2; b >= 0; b--) {
    bits[2 - b] = ((n >> b) & 1) ? '1' : '0';
  }
  return bits.join('');
}
