/** Pegs[i] = array of disc sizes on peg i, index 0 = bottom disc (largest), last = top disc (smallest) */
export type PegIndex = 0 | 1 | 2;
export type Move = readonly [PegIndex, PegIndex];
export type Pegs = [number[], number[], number[]];
const DEFAULT_PEGS: Pegs = [[], [], []];

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

function asPegIndex(value: number): PegIndex {
  if (value !== 0 && value !== 1 && value !== 2) {
    throw new RangeError('Peg index is out of range.');
  }

  return value;
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
  if (n > 53) {
    throw new RangeError('Disc count must be 53 or less for a safe integer move count.');
  }
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

  const next = pegs.map((p) => [...p]) as Pegs;
  const disc = next[from].pop()!;
  const topDestinationDisc = next[to][next[to].length - 1];
  if (topDestinationDisc !== undefined && disc > topDestinationDisc) {
    throw new RangeError('Cannot place a larger disc onto a smaller disc.');
  }
  next[to].push(disc);
  return next;
}

/** True when all n discs are on targetPeg in valid order */
export function isSolved(pegs: Pegs, n: number, targetPeg = 2): boolean {
  validateDiscCount(n);
  validatePegIndex(pegs, targetPeg);

  if (pegs.some((peg, index) => index !== targetPeg && peg.length !== 0)) return false;
  if (pegs[targetPeg].length !== n) return false;

  return pegs[targetPeg].every((disc, index, peg) => index === 0 || peg[index - 1] > disc);
}

/**
 * Compute the optimal recursive solution.
 * Returns an ordered array of [from, to] peg-index pairs.
 * Default: move all discs from peg 0 to peg 2 using peg 1 as auxiliary.
 */
export function solveHanoi(n: number, from = 0, to = 2, aux = 1): [number, number][] {
  validateDiscCount(n);
  const fromPeg = asPegIndex(from);
  const toPeg = asPegIndex(to);
  const auxPeg = asPegIndex(aux);

  if (new Set([fromPeg, toPeg, auxPeg]).size !== 3) {
    throw new RangeError('Source, target, and auxiliary pegs must be distinct.');
  }

  const moves: Move[] = [];
  function recurse(k: number, f: PegIndex, t: PegIndex, a: PegIndex) {
    if (k === 0) return;
    recurse(k - 1, f, a, t);
    moves.push([f, t]);
    recurse(k - 1, a, t, f);
  }
  recurse(n, fromPeg, toPeg, auxPeg);
  return moves;
}
