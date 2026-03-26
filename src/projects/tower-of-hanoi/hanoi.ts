/** Three pegs; each peg is bottom→top. Disc indices 0 = largest … n-1 = smallest. */
export type Pegs = [number[], number[], number[]];

export function createInitialState(n: number): Pegs {
  const a: number[] = [];
  for (let i = 0; i < n; i++) a.push(i);
  return [a, [], []];
}

export function optimalMoveCount(n: number): number {
  return 2 ** n - 1;
}

export function isValidMove(pegs: Pegs, from: number, to: number): boolean {
  if (from < 0 || from > 2 || to < 0 || to > 2 || from === to) return false;
  const fromPeg = pegs[from];
  if (fromPeg.length === 0) return false;
  const disc = fromPeg[fromPeg.length - 1]!;
  const toPeg = pegs[to];
  if (toPeg.length === 0) return true;
  const topTo = toPeg[toPeg.length - 1]!;
  /* Larger disc = smaller index. Placing d on top of t requires t larger below → topTo < disc */
  return topTo < disc;
}

export function applyMove(pegs: Pegs, from: number, to: number): Pegs {
  if (!isValidMove(pegs, from, to)) return pegs;
  const next: Pegs = [pegs[0].slice(), pegs[1].slice(), pegs[2].slice()];
  const disc = next[from].pop()!;
  next[to].push(disc);
  return next;
}

export function isSolved(pegs: Pegs, targetPeg = 2): boolean {
  const target = pegs[targetPeg];
  const n = pegs[0].length + pegs[1].length + pegs[2].length;
  if (n === 0) return false;
  return target.length === n;
}

/** Optimal move sequence as [fromPeg, toPeg][] for n discs from default start. */
export function solveHanoi(n: number, from = 0, to = 2, aux = 1): [number, number][] {
  if (n === 0) return [];
  return [
    ...solveHanoi(n - 1, from, aux, to),
    [from, to],
    ...solveHanoi(n - 1, aux, to, from)
  ];
}
