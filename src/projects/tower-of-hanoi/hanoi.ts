export type PegIndex = 0 | 1 | 2;
export type Move = readonly [PegIndex, PegIndex];
export type Pegs = [number[], number[], number[]];

function asPegIndex(value: number): PegIndex {
  if (value !== 0 && value !== 1 && value !== 2) {
    throw new Error(`Invalid peg index: ${value}`);
  }

  return value;
}

function assertDiscCount(discCount: number, minimum: number): void {
  if (!Number.isFinite(discCount) || !Number.isInteger(discCount) || discCount < minimum) {
    const requirement = minimum === 0 ? "a non-negative integer" : "a positive integer";
    throw new RangeError(`discCount must be ${requirement}. Received: ${discCount}`);
  }
}

export function createInitialState(discCount: number): Pegs {
  assertDiscCount(discCount, 1);

  return [
    Array.from({ length: discCount }, (_, index) => discCount - index),
    [],
    []
  ];
}

export function optimalMoveCount(discCount: number): number {
  assertDiscCount(discCount, 0);
  return 2 ** discCount - 1;
}

export function isValidMove(pegs: Pegs, from: number, to: number): boolean {
  if (
    from === to ||
    !Number.isInteger(from) ||
    from < 0 ||
    from > 2 ||
    !Number.isInteger(to) ||
    to < 0 ||
    to > 2
  ) {
    return false;
  }

  const sourcePeg = pegs[from];
  const targetPeg = pegs[to];
  const movingDisc = sourcePeg[sourcePeg.length - 1];
  const targetDisc = targetPeg[targetPeg.length - 1];

  if (movingDisc === undefined) {
    return false;
  }

  return targetDisc === undefined || movingDisc < targetDisc;
}

export function applyMove(pegs: Pegs, from: number, to: number): Pegs {
  if (!isValidMove(pegs, from, to)) {
    return pegs;
  }

  const nextPegs = pegs.map((peg) => [...peg]) as Pegs;
  const movingDisc = nextPegs[from].pop();

  if (movingDisc === undefined) {
    return pegs;
  }

  nextPegs[to].push(movingDisc);
  return nextPegs;
}

export function isSolved(pegs: Pegs, targetPeg: number = 2): boolean {
  if (!Number.isInteger(targetPeg) || targetPeg < 0 || targetPeg >= pegs.length) {
    return false;
  }

  const target = pegs[targetPeg];
  const discCount = pegs[0].length + pegs[1].length + pegs[2].length;

  if (target.length !== discCount) {
    return false;
  }

  return target.every((disc, index) => disc === discCount - index);
}

function solveRecursive(discCount: number, from: PegIndex, to: PegIndex, aux: PegIndex): Move[] {
  if (discCount === 0) {
    return [];
  }

  return [
    ...solveRecursive(discCount - 1, from, aux, to),
    [from, to],
    ...solveRecursive(discCount - 1, aux, to, from)
  ];
}

export function solveHanoi(
  discCount: number,
  from: number = 0,
  to: number = 2,
  aux: number = 1
): Move[] {
  assertDiscCount(discCount, 0);

  const fromPeg = asPegIndex(from);
  const toPeg = asPegIndex(to);
  const auxPeg = asPegIndex(aux);

  if (new Set([fromPeg, toPeg, auxPeg]).size !== 3) {
    throw new Error("from, to, and aux peg indices must all be distinct");
  }

  return solveRecursive(discCount, fromPeg, toPeg, auxPeg);
}
