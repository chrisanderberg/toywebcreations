import { useCallback, useEffect, useMemo, useState } from 'react';
import './styles.css';

/** Easier starter puzzle — unique solution; some givens for quick play. */
const INITIAL: (number | null)[] = [
  5, 3, null, null, 7, null, null, null, null,
  6, null, null, 1, 9, 5, null, null, null,
  null, 9, 8, null, null, null, null, 6, null,
  8, null, null, null, 6, null, null, null, 3,
  4, null, null, 8, null, 3, null, null, 1,
  7, null, null, null, 2, null, null, null, 6,
  null, 6, null, null, null, null, 2, 8, null,
  null, null, null, 4, 1, 9, null, null, 5,
  null, null, null, null, 8, null, null, 7, 9,
];

function cloneGrid(g: (number | null)[]) {
  return g.slice();
}

function boxIndex(i: number) {
  const r = Math.floor(i / 9);
  const c = i % 9;
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

function conflicts(grid: (number | null)[], index: number, value: number): boolean {
  const r = Math.floor(index / 9);
  const c = index % 9;
  const b = boxIndex(index);
  for (let i = 0; i < 81; i++) {
    if (i === index) continue;
    const v = grid[i];
    if (v === null || v !== value) continue;
    const ri = Math.floor(i / 9);
    const ci = i % 9;
    const bi = boxIndex(i);
    if (ri === r || ci === c || bi === b) return true;
  }
  return false;
}

function gridHasConflicts(grid: (number | null)[]) {
  for (let i = 0; i < grid.length; i++) {
    const v = grid[i];
    if (v !== null && conflicts(grid, i, v)) return true;
  }
  return false;
}

function isComplete(grid: (number | null)[]) {
  return grid.every((c) => c !== null) && !gridHasConflicts(grid);
}

export default function SudokuDemo() {
  const given = useMemo(() => INITIAL.map((v) => v !== null), []);
  const [grid, setGrid] = useState(() => cloneGrid(INITIAL));
  const [selected, setSelected] = useState<number | null>(40);
  const [showErrors, setShowErrors] = useState(false);

  const conflictSet = useMemo(() => {
    const s = new Set<number>();
    for (let i = 0; i < grid.length; i++) {
      const v = grid[i];
      if (v !== null && conflicts(grid, i, v)) s.add(i);
    }
    return s;
  }, [grid]);

  const solved = isComplete(grid);

  const setCell = useCallback(
    (index: number, value: number | null) => {
      if (given[index]) return;
      setGrid((g) => {
        const next = cloneGrid(g);
        next[index] = value;
        return next;
      });
    },
    [given],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null || given[selected]) return;
      if (e.key >= '1' && e.key <= '9') {
        const n = Number(e.key);
        setCell(selected, n);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setCell(selected, null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, given, setCell]);

  const reset = () => {
    setGrid(cloneGrid(INITIAL));
    setShowErrors(false);
  };

  return (
    <div className="sudoku-demo">
      <div className="sudoku-demo__toolbar">
        <button type="button" className="sudoku-demo__btn" onClick={reset}>
          Reset puzzle
        </button>
        <button
          type="button"
          className="sudoku-demo__btn"
          onClick={() => setShowErrors((v) => !v)}
        >
          {showErrors ? 'Hide conflicts' : 'Show conflicts'}
        </button>
      </div>
      <p className="sudoku-demo__hint">
        Select a cell. Type <kbd>1–9</kbd> to fill, <kbd>Delete</kbd> to clear. Glowing cells are
        givens.
      </p>
      <div className="sudoku-demo__grid-wrap">
        <div className="sudoku-demo__grid" role="grid" aria-label="Sudoku board">
          {grid.map((value, i) => {
            const c = i % 9;
            const r = Math.floor(i / 9);
            const thickRight = c === 2 || c === 5;
            const thickBottom = r === 2 || r === 5;
            const isGiven = given[i];
            const err = showErrors && conflictSet.has(i);
            const classes = [
              'sudoku-demo__cell',
              thickRight ? 'sudoku-demo__cell--thick-right' : '',
              thickBottom ? 'sudoku-demo__cell--thick-bottom' : '',
              isGiven ? 'sudoku-demo__cell--given' : '',
              selected === i ? 'sudoku-demo__cell--selected' : '',
              err ? 'sudoku-demo__cell--error' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                className={classes}
                onClick={() => setSelected(i)}
                aria-label={
                  value != null
                    ? `Cell ${r + 1},${c + 1}, value ${value}`
                    : `Cell ${r + 1},${c + 1}, empty`
                }
              >
                {value ?? ''}
              </button>
            );
          })}
        </div>
      </div>
      <p className={`sudoku-demo__status${solved ? ' sudoku-demo__status--ok' : ''}`}>
        {solved
          ? 'Grid complete with no conflicts — nice.'
          : showErrors && conflictSet.size > 0
            ? 'Highlighted cells disagree with Sudoku rules.'
            : '\u00a0'}
      </p>
    </div>
  );
}
