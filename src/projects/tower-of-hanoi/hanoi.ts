/** Pegs[i] = array of disc sizes on peg i, index 0 = bottom disc (largest), last = top disc (smallest) */
export type Pegs = number[][];

function validateDiscCount(n: number): void {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('Disc count must be a non-negative integer.');
  }
}

function validatePegIndex(pegs: Pegs, pegIndex: number): void {
  if (!Number.isInteger(pegIndex) || pegIndex < 0 || pegIndex >= pegs.length) {
    throw new RangeError('Peg index is out of range.');
  }
}

/** Create initial state: all n discs stacked on peg 0, largest at bottom */
export function createInitialState(n: number): Pegs {
  validateDiscCount(n);
  return [
    Array.from({ length: n }, (_, i) => n - i),
    [],
    [],
  ];
}

/** Optimal move count for n discs: 2^n - 1 */
export function optimalMoveCount(n: number): number {
  validateDiscCount(n);
  return Math.pow(2, n) - 1;
}

/** Whether moving the top disc from `from` to `to` is a valid move */
export function isValidMove(pegs: Pegs, from: number, to: number): boolean {
  validatePegIndex(pegs, from);
  validatePegIndex(pegs, to);
  if (from === to) return false;
  if (pegs[from].length === 0) return false;
  if (pegs[to].length === 0) return true;
  return pegs[from][pegs[from].length - 1] < pegs[to][pegs[to].length - 1];
}

/** Apply a move (does not validate) — returns new Pegs array (immutable) */
export function applyMove(pegs: Pegs, from: number, to: number): Pegs {
  validatePegIndex(pegs, from);
  validatePegIndex(pegs, to);
  if (pegs[from].length === 0) {
    throw new RangeError('Cannot move a disc from an empty peg.');
  }

  const next = pegs.map((p) => [...p]);
  const disc = next[from].pop()!;
  next[to].push(disc);
  return next;
}

/** True when all n discs are on targetPeg in valid order */
export function isSolved(pegs: Pegs, n: number, targetPeg = 2): boolean {
  return pegs[targetPeg].length === n;
}

/**
 * Compute the optimal recursive solution.
 * Returns an ordered array of [from, to] peg-index pairs.
 * Default: move all discs from peg 0 to peg 2 using peg 1 as auxiliary.
 */
export function solveHanoi(n: number, from = 0, to = 2, aux = 1): [number, number][] {
  validateDiscCount(n);
  const moves: [number, number][] = [];
  function recurse(k: number, f: number, t: number, a: number) {
    if (k === 0) return;
    recurse(k - 1, f, a, t);
    moves.push([f, t]);
    recurse(k - 1, a, t, f);
  }
  recurse(n, from, to, aux);
  return moves;
}
