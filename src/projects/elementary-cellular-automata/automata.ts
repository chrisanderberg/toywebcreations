const MIN_RULE = 0;
const MAX_RULE = 255;

function clampRule(rule: number): number {
  return Math.min(MAX_RULE, Math.max(MIN_RULE, Math.floor(rule)));
}

function clampDensity(density: number): number {
  if (Number.isNaN(density)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, density));
}

export function ruleToMapping(rule: number): Array<[number, number]> {
  const normalizedRule = clampRule(rule);

  return Array.from({ length: 8 }, (_, offset) => {
    const neighborhood = 7 - offset;
    const output = (normalizedRule >> neighborhood) & 1;
    return [neighborhood, output];
  });
}

export function evolveRow(row: number[], rule: number): number[] {
  const normalizedRule = clampRule(rule);

  return row.map((_, index) => {
    const left = index > 0 ? row[index - 1] : 0;
    const self = row[index] ?? 0;
    const right = index < row.length - 1 ? row[index + 1] : 0;
    const neighborhood = (left << 2) | (self << 1) | right;

    return (normalizedRule >> neighborhood) & 1;
  });
}

export function generatePattern(initialRow: number[], rule: number, numRows: number): number[][] {
  const safeRows = Math.max(1, Math.floor(numRows));
  const pattern: number[][] = [initialRow];

  while (pattern.length < safeRows) {
    pattern.push(evolveRow(pattern[pattern.length - 1], rule));
  }

  return pattern;
}

export function createCenteredSeed(width: number): number[] {
  const safeWidth = Math.max(1, Math.floor(width));
  const row = Array.from({ length: safeWidth }, () => 0);
  row[Math.floor(safeWidth / 2)] = 1;
  return row;
}

export function createRandomSeed(width: number, density: number = 0.5): number[] {
  const safeWidth = Math.max(1, Math.floor(width));
  const safeDensity = clampDensity(density);

  return Array.from({ length: safeWidth }, () => (Math.random() < safeDensity ? 1 : 0));
}

