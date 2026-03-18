import { useState, useEffect, useCallback, useRef } from 'react';
import { generatePuzzle, findConflicts, isSolved, solvePuzzle } from './sudoku';
import type { Grid, Difficulty } from './sudoku';
import './Demo.css';

// --- Types ---

interface CellState {
  value: number;
  isGiven: boolean;
  notes: Set<number>;
}

type BoardState = CellState[][];

// --- Helpers ---

function gridToCells(puzzle: Grid): BoardState {
  return puzzle.map((row) =>
    row.map((val) => ({
      value: val,
      isGiven: val !== 0,
      notes: new Set<number>(),
    }))
  );
}

function cellsToGrid(board: BoardState): Grid {
  return board.map((row) => row.map((c) => c.value));
}

function sameBox(r1: number, c1: number, r2: number, c2: number): boolean {
  return Math.floor(r1 / 3) === Math.floor(r2 / 3) && Math.floor(c1 / 3) === Math.floor(c2 / 3);
}

function isPeer(selRow: number, selCol: number, r: number, c: number): boolean {
  return selRow === r || selCol === c || sameBox(selRow, selCol, r, c);
}

// --- Component ---

export default function SudokuDemo() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<BoardState>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [notesMode, setNotesMode] = useState(false);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const newGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(gridToCells(puzzle));
    setSolution(sol);
    setSelected(null);
    setConflicts(new Set());
    setSolved(false);
    setTimer(0);
    setRunning(true);
  }, []);

  // Initial puzzle
  useEffect(() => {
    newGame('medium');
  }, [newGame]);

  // Timer
  useEffect(() => {
    if (!running || solved) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running, solved]);

  useEffect(() => {
    if (board.length === 0 || solution.length === 0) return;

    const grid = cellsToGrid(board);
    const nextSolved = isSolved(grid, solution);

    setConflicts(findConflicts(grid));
    setSolved(nextSolved);

    if (nextSolved) {
      setRunning(false);
    }
  }, [board, solution]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const setCell = useCallback(
    (row: number, col: number, num: number) => {
      setBoard((prev) => {
        const next = prev.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
        const cell = next[row][col];
        if (cell.isGiven) return prev;

        if (notesMode) {
          if (num === 0) {
            cell.notes.clear();
          } else {
            if (cell.notes.has(num)) cell.notes.delete(num);
            else cell.notes.add(num);
          }
          cell.value = 0;
        } else {
          cell.value = num === cell.value ? 0 : num;
          cell.notes.clear();
        }

        return next;
      });
    },
    [notesMode]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selected) return;
      const [row, col] = selected;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        setCell(row, col, parseInt(e.key));
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        setCell(row, col, 0);
      } else if (e.key === 'ArrowUp' && row > 0) {
        e.preventDefault();
        setSelected([row - 1, col]);
      } else if (e.key === 'ArrowDown' && row < 8) {
        e.preventDefault();
        setSelected([row + 1, col]);
      } else if (e.key === 'ArrowLeft' && col > 0) {
        e.preventDefault();
        setSelected([row, col - 1]);
      } else if (e.key === 'ArrowRight' && col < 8) {
        e.preventDefault();
        setSelected([row, col + 1]);
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesMode((m) => !m);
      }
    },
    [selected, setCell]
  );

  const handleReveal = () => {
    if (!selected) return;
    const [row, col] = selected;
    if (board[row][col].isGiven) return;
    setBoard((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
      next[row][col].value = solution[row][col];
      next[row][col].notes.clear();
      return next;
    });
  };

  const handleSolveAll = () => {
    setBoard(gridToCells(solution));
    setConflicts(new Set());
    setSolved(true);
    setRunning(false);
  };

  if (board.length === 0) {
    return (
      <div className="sudoku-loading">
        <span>GENERATING PUZZLE...</span>
      </div>
    );
  }

  const [selRow, selCol] = selected ?? [-1, -1];
  const selectedValue = selected ? board[selRow][selCol].value : 0;

  return (
    <div className="sudoku-wrap" onKeyDown={handleKeyDown} tabIndex={-1} ref={gridRef}>
      {/* Header bar */}
      <div className="sudoku-header">
        <div className="sudoku-meta">
          <span className="diff-label">{difficulty.toUpperCase()}</span>
          <span className="timer">{formatTime(timer)}</span>
        </div>
        <div className="sudoku-controls">
          <div className="diff-buttons">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={`diff-btn${difficulty === d ? ' active' : ''}`}
                onClick={() => {
                  setDifficulty(d);
                  newGame(d);
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <button className="ctrl-btn" onClick={() => newGame(difficulty)}>
            New Game
          </button>
        </div>
      </div>

      {/* Solved banner */}
      {solved && (
        <div className="solved-banner">
          <span>✓ SOLVED</span>
          <span className="solved-time">{formatTime(timer)}</span>
        </div>
      )}

      {/* Grid */}
      <div className="sudoku-board" aria-label="Sudoku grid">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`;
            const isSelected = r === selRow && c === selCol;
            const isPeerCell = selected && !isSelected && isPeer(selRow, selCol, r, c);
            const isSameValue =
              selected && !isSelected && selectedValue !== 0 && cell.value === selectedValue;
            const isConflict = conflicts.has(key);

            let cellClass = 'sudoku-cell';
            if (cell.isGiven) cellClass += ' given';
            if (isSelected) cellClass += ' selected';
            else if (isConflict) cellClass += ' conflict';
            else if (isSameValue) cellClass += ' same-value';
            else if (isPeerCell) cellClass += ' peer';

            return (
              <div
                key={key}
                className={cellClass}
                data-row={r}
                data-col={c}
                data-box={`${Math.floor(r / 3)}-${Math.floor(c / 3)}`}
                onClick={() => setSelected([r, c])}
                role="gridcell"
                aria-selected={isSelected}
                aria-label={`Row ${r + 1}, Column ${c + 1}: ${cell.value || 'empty'}`}
                tabIndex={isSelected ? 0 : -1}
              >
                {cell.value !== 0 ? (
                  <span className="cell-value">{cell.value}</span>
                ) : cell.notes.size > 0 ? (
                  <div className="notes-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span key={n} className={`note${cell.notes.has(n) ? ' visible' : ''}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Number pad + actions */}
      <div className="sudoku-actions">
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              className="num-btn"
              onClick={() => selected && setCell(selRow, selCol, n)}
              aria-label={`Enter ${n}`}
            >
              {n}
            </button>
          ))}
          <button
            className="num-btn erase-btn"
            onClick={() => selected && setCell(selRow, selCol, 0)}
            aria-label="Erase cell"
          >
            ⌫
          </button>
        </div>

        <div className="action-buttons">
          <button
            className={`action-btn${notesMode ? ' active' : ''}`}
            onClick={() => setNotesMode((m) => !m)}
            title="Toggle notes mode (N)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Notes {notesMode ? 'ON' : 'OFF'}
          </button>
          <button
            className="action-btn"
            onClick={handleReveal}
            disabled={!selected || (selected && board[selRow][selCol].isGiven)}
            title="Reveal selected cell"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="3"/>
              <path d="M20.188 10.934C21.223 11.892 21.223 12.108 20.188 13.066 17.161 15.856 14.755 17 12 17c-2.755 0-5.161-1.144-8.188-3.934C2.777 12.108 2.777 11.892 3.812 10.934 6.839 8.144 9.245 7 12 7c2.755 0 5.161 1.144 8.188 3.934z"/>
            </svg>
            Hint
          </button>
          <button
            className="action-btn action-btn--danger"
            onClick={handleSolveAll}
            title="Reveal full solution"
          >
            Solve
          </button>
        </div>
      </div>
    </div>
  );
}
