import { useCallback, useMemo, useState } from "react";
import "./Demo.css";

/** Classic newspaper-style seed (81 digits, 0 = blank). */
const GIVEN: number[] = [
  5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 6, 0, 8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2, 0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0, 0, 8, 0, 0, 7, 9
];

function cloneGivenMask(): boolean[] {
  return GIVEN.map((n) => n !== 0);
}

function allConflictIndices(grid: number[]): Set<number> {
  const conflicts = new Set<number>();
  for (let i = 0; i < 81; i++) {
    const v = grid[i];
    if (v === 0) continue;
    const row = Math.floor(i / 9);
    const col = i % 9;
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let j = i + 1; j < 81; j++) {
      if (grid[j] !== v) continue;
      const r2 = Math.floor(j / 9);
      const c2 = j % 9;
      if (
        row === r2 ||
        col === c2 ||
        (r2 >= br && r2 < br + 3 && c2 >= bc && c2 < bc + 3)
      ) {
        conflicts.add(i);
        conflicts.add(j);
      }
    }
  }
  return conflicts;
}

export default function SudokuDemo() {
  const initialGrid = useMemo(() => [...GIVEN], []);
  const [grid, setGrid] = useState<number[]>(() => [...GIVEN]);
  const [fixed] = useState<boolean[]>(() => cloneGivenMask());
  const [selected, setSelected] = useState<number | null>(null);

  const conflicts = useMemo(() => allConflictIndices(grid), [grid]);

  const reset = useCallback(() => {
    setGrid([...initialGrid]);
    setSelected(null);
  }, [initialGrid]);

  const setCell = useCallback(
    (index: number, value: number) => {
      if (fixed[index]) return;
      setGrid((g) => {
        const next = [...g];
        next[index] = value;
        return next;
      });
    },
    [fixed]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selected === null) return;
      if (fixed[selected]) return;
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        setCell(selected, Number(e.key));
      }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        e.preventDefault();
        setCell(selected, 0);
      }
    },
    [selected, fixed, setCell]
  );

  return (
    <div className="sudoku-demo">
      <p className="sudoku-demo__hint">
        Click a cell, type <kbd>1</kbd>–<kbd>9</kbd>, or <kbd>Delete</kbd> to clear. Given cells are
        locked. Red highlights mark conflicts.
      </p>
      <div
        className="sudoku-demo__grid-wrap"
        tabIndex={0}
        role="application"
        aria-label="Sudoku grid"
        onKeyDown={onKeyDown}
      >
        <div className="sudoku-demo__grid">
          {grid.map((value, i) => {
            const isFixed = fixed[i];
            const isSelected = selected === i;
            const conflict = conflicts.has(i);
            return (
              <button
                key={i}
                type="button"
                className={[
                  "sudoku-demo__cell",
                  isFixed ? "sudoku-demo__cell--fixed" : "",
                  isSelected ? "sudoku-demo__cell--selected" : "",
                  conflict ? "sudoku-demo__cell--conflict" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelected(i)}
                aria-label={`Row ${Math.floor(i / 9) + 1} column ${(i % 9) + 1}`}
              >
                {value === 0 ? "" : value}
              </button>
            );
          })}
        </div>
      </div>
      <div className="sudoku-demo__toolbar">
        <div className="sudoku-demo__numpad" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              className="sudoku-demo__num"
              onClick={() => selected !== null && !fixed[selected] && setCell(selected, n)}
              disabled={selected === null ? true : fixed[selected]}
            >
              {n}
            </button>
          ))}
        </div>
        <button type="button" className="sudoku-demo__reset" onClick={reset}>
          Reset puzzle
        </button>
      </div>
    </div>
  );
}
