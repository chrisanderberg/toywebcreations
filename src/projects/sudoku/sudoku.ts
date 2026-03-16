/* Sudoku puzzle generation and solving utilities */

export type Grid = number[][]; // 9x9, 0 = empty

// --- Helpers ---

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function emptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function cloneGrid(g: Grid): Grid {
  return g.map((row) => [...row]);
}

function isValidPlacement(grid: Grid, row: number, col: number, num: number): boolean {
  // Row check
  if (grid[row].includes(num)) return false;
  // Column check
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }
  // Box check
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

/** Fill grid with a valid complete solution using backtracking. */
function fillGrid(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (const num of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/** Count solutions (stops at 2 — we only need to know if unique). */
function countSolutions(grid: Grid, limit = 2): number {
  let count = 0;
  function solve(g: Grid): void {
    if (count >= limit) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(g, row, col, num)) {
              g[row][col] = num;
              solve(g);
              g[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  solve(cloneGrid(grid));
  return count;
}

/** Remove numbers from a complete grid to create a puzzle with a unique solution. */
function digHoles(solved: Grid, clues: number): Grid {
  const puzzle = cloneGrid(solved);
  const positions = shuffled(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );

  let removed = 0;
  const target = 81 - clues;

  for (const [row, col] of positions) {
    if (removed >= target) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSolutions(puzzle) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

const CLUE_COUNTS: Record<Difficulty, number> = {
  easy:   38,
  medium: 30,
  hard:   25,
};

/**
 * Generate a Sudoku puzzle.
 * Returns { puzzle, solution }.
 */
export function generatePuzzle(difficulty: Difficulty = 'medium'): {
  puzzle: Grid;
  solution: Grid;
} {
  const solution = emptyGrid();
  fillGrid(solution);
  const puzzle = digHoles(solution, CLUE_COUNTS[difficulty]);
  return { puzzle, solution };
}

/**
 * Solve a given puzzle grid.
 * Returns the solved grid or null if no solution.
 */
export function solvePuzzle(puzzle: Grid): Grid | null {
  const grid = cloneGrid(puzzle);
  function backtrack(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              if (backtrack()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  return backtrack() ? grid : null;
}

/** Return a set of conflict cells as "row,col" strings. */
export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      if (val === 0) continue;

      // Row
      for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c] === val) {
          conflicts.add(`${row},${col}`);
          conflicts.add(`${row},${c}`);
        }
      }
      // Col
      for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col] === val) {
          conflicts.add(`${row},${col}`);
          conflicts.add(`${r},${col}`);
        }
      }
      // Box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && grid[r][c] === val) {
            conflicts.add(`${row},${col}`);
            conflicts.add(`${r},${c}`);
          }
        }
      }
    }
  }

  return conflicts;
}

/** Return true if grid is completely and correctly filled. */
export function isSolved(grid: Grid, solution: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}
