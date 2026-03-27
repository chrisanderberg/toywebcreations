import { useState, useEffect, useRef, useCallback } from 'react';
import './Demo.css';

// --- Constants ---

const CELL_SIZE = 14;
const DEFAULT_COLS = 60;
const DEFAULT_ROWS = 40;
const DEFAULT_FPS = 12;

// --- Types ---

type Grid = boolean[][];

// --- Helpers ---

function emptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

function randomGrid(rows: number, cols: number, density = 0.3): Grid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < density)
  );
}

function nextGeneration(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  return grid.map((row, r) =>
    row.map((alive, c) => {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          if (grid[nr][nc]) neighbors++;
        }
      }
      // Conway's rules: alive cell survives with 2 or 3 neighbors;
      // dead cell becomes alive with exactly 3 neighbors.
      return alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
    })
  );
}

function countAlive(grid: Grid): number {
  return grid.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

// --- Preset patterns ---

interface Pattern {
  name: string;
  cells: [number, number][];
}

const PATTERNS: Pattern[] = [
  {
    name: 'Glider',
    cells: [[0,1],[1,2],[2,0],[2,1],[2,2]],
  },
  {
    name: 'Blinker',
    cells: [[1,0],[1,1],[1,2]],
  },
  {
    name: 'Pulsar',
    cells: [
      [0,2],[0,3],[0,4],[0,8],[0,9],[0,10],
      [2,0],[2,5],[2,7],[2,12],
      [3,0],[3,5],[3,7],[3,12],
      [4,0],[4,5],[4,7],[4,12],
      [5,2],[5,3],[5,4],[5,8],[5,9],[5,10],
      [7,2],[7,3],[7,4],[7,8],[7,9],[7,10],
      [8,0],[8,5],[8,7],[8,12],
      [9,0],[9,5],[9,7],[9,12],
      [10,0],[10,5],[10,7],[10,12],
      [12,2],[12,3],[12,4],[12,8],[12,9],[12,10],
    ],
  },
  {
    name: 'Gosper Gun',
    cells: [
      [5,1],[5,2],[6,1],[6,2],
      [5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],[3,14],[9,14],
      [6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],
      [3,21],[4,21],[5,21],[3,22],[4,22],[5,22],
      [2,23],[6,23],[1,25],[2,25],[6,25],[7,25],
      [3,35],[4,35],[3,36],[4,36],
    ],
  },
  {
    name: 'R-pentomino',
    cells: [[0,1],[0,2],[1,0],[1,1],[2,1]],
  },
];

function placePattern(grid: Grid, pattern: Pattern): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  const patRows = Math.max(...pattern.cells.map(([r]) => r)) + 1;
  const patCols = Math.max(...pattern.cells.map(([, c]) => c)) + 1;
  const originR = Math.floor((rows - patRows) / 2);
  const originC = Math.floor((cols - patCols) / 2);

  const next = grid.map((row) => [...row]);
  for (const [r, c] of pattern.cells) {
    const nr = originR + r;
    const nc = originC + c;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      next[nr][nc] = true;
    }
  }
  return next;
}

// --- Component ---

export default function ConwayDemo() {
  const [grid, setGrid] = useState<Grid>(() => randomGrid(DEFAULT_ROWS, DEFAULT_COLS));
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [fps, setFps] = useState(DEFAULT_FPS);
  const [drawMode, setDrawMode] = useState<'draw' | 'erase'>('draw');
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>(grid);
  const animRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  // Keep gridRef in sync
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Derive canvas dimensions
  const canvasWidth = DEFAULT_COLS * CELL_SIZE;
  const canvasHeight = DEFAULT_ROWS * CELL_SIZE;

  // --- Draw canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#221C14';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(58, 48, 32, 0.6)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= DEFAULT_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(canvasWidth, r * CELL_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= DEFAULT_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, canvasHeight);
      ctx.stroke();
    }

    // Live cells
    for (let r = 0; r < DEFAULT_ROWS; r++) {
      for (let c = 0; c < DEFAULT_COLS; c++) {
        if (!grid[r][c]) continue;
        const x = c * CELL_SIZE + 1;
        const y = r * CELL_SIZE + 1;
        const size = CELL_SIZE - 2;

        // Glow effect
        ctx.shadowColor = 'rgba(212, 165, 116, 0.3)';
        ctx.shadowBlur = 6;

        ctx.fillStyle = '#D4A574';
        ctx.fillRect(x, y, size, size);
      }
    }
    ctx.shadowBlur = 0;

    // Keyboard focus indicator
    const [focusedRow, focusedCol] = focusedCell;
    const focusX = focusedCol * CELL_SIZE + 0.5;
    const focusY = focusedRow * CELL_SIZE + 0.5;
    const focusSize = CELL_SIZE - 1;

    ctx.save();
    ctx.fillStyle = 'rgba(212, 165, 116, 0.12)';
    ctx.fillRect(focusX, focusY, focusSize, focusSize);
    ctx.strokeStyle = '#E8C19A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(focusX, focusY, focusSize, focusSize);
    ctx.restore();
  }, [grid, focusedCell, canvasWidth, canvasHeight]);

  // --- Simulation loop ---
  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      const interval = 1000 / fps;
      if (timestamp - lastTickRef.current >= interval) {
        lastTickRef.current = timestamp;
        setGrid((prev) => {
          const next = nextGeneration(prev);
          gridRef.current = next;
          return next;
        });
        setGeneration((g) => g + 1);
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, fps]);

  // --- Pointer interaction ---
  const getCellFromEvent = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): [number, number] | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);
      if (row < 0 || row >= DEFAULT_ROWS || col < 0 || col >= DEFAULT_COLS) return null;
      return [row, col];
    },
    [canvasWidth, canvasHeight]
  );

  const paintCell = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      const [row, col] = cell;
      setFocusedCell([row, col]);
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = drawMode === 'draw';
        return next;
      });
    },
    [getCellFromEvent, drawMode]
  );

  const paintCellAt = useCallback((row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = drawMode === 'draw';
      return next;
    });
  }, [drawMode]);

  const releasePointerCapture = (target: EventTarget | null, pointerId: number) => {
    if (!(target instanceof HTMLElement)) return;
    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPointerDown(true);
    paintCell(e);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerDown) paintCell(e);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPointerDown(false);
    releasePointerCapture(e.currentTarget, e.pointerId);
  };
  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPointerDown(false);
    releasePointerCapture(e.currentTarget, e.pointerId);
  };
  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPointerDown(false);
    releasePointerCapture(e.currentTarget, e.pointerId);
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const [row, col] = focusedCell;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedCell([Math.max(0, row - 1), col]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedCell([Math.min(DEFAULT_ROWS - 1, row + 1), col]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocusedCell([row, Math.max(0, col - 1)]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setFocusedCell([row, Math.min(DEFAULT_COLS - 1, col + 1)]);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      paintCellAt(row, col);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // --- Controls ---
  const handleClear = () => {
    setGrid(emptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
    setGeneration(0);
    setRunning(false);
  };

  const handleRandom = () => {
    setGrid(randomGrid(DEFAULT_ROWS, DEFAULT_COLS));
    setGeneration(0);
  };

  const handleLoadPattern = (pattern: Pattern) => {
    const base = emptyGrid(DEFAULT_ROWS, DEFAULT_COLS);
    setGrid(placePattern(base, pattern));
    setGeneration(0);
    setRunning(false);
  };

  const handleStep = () => {
    setGrid((prev) => nextGeneration(prev));
    setGeneration((g) => g + 1);
  };

  const alive = countAlive(grid);

  return (
    <div className="conway-wrap">
      {/* Top bar */}
      <div className="conway-bar conway-bar--top">
        <div className="conway-stats">
          <span className="stat">
            <span className="stat-label">GEN</span>
            <span className="stat-value">{generation.toString().padStart(5, '0')}</span>
          </span>
          <span className="stat">
            <span className="stat-label">ALIVE</span>
            <span className="stat-value">{alive.toString().padStart(5, '0')}</span>
          </span>
        </div>

        <div className="conway-playback">
          <button
            className={`play-btn${running ? ' running' : ''}`}
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? 'Pause' : 'Play'}
          >
            {running ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button className="ctrl-btn-sm" onClick={handleStep} disabled={running} title="Step one generation">
            ⊕ Step
          </button>
          <div className="fps-control">
            <span className="stat-label">FPS</span>
            <input
              type="range"
              min={1}
              max={30}
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="fps-slider"
              aria-label="Simulation speed"
            />
            <span className="fps-value">{fps}</span>
          </div>
        </div>

        <div className="conway-tool-btns">
          <button
            className={`tool-btn${drawMode === 'draw' ? ' active' : ''}`}
            onClick={() => setDrawMode('draw')}
            title="Draw cells"
          >
            ✏ Draw
          </button>
          <button
            className={`tool-btn${drawMode === 'erase' ? ' active' : ''}`}
            onClick={() => setDrawMode('erase')}
            title="Erase cells"
          >
            ⌫ Erase
          </button>
          <button className="ctrl-btn-sm" onClick={handleRandom} title="Random fill">
            ⚡ Random
          </button>
          <button className="ctrl-btn-sm ctrl-btn-sm--danger" onClick={handleClear} title="Clear all">
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <div className="conway-status" aria-live="polite">
          Focused cell: row {focusedCell[0] + 1}, column {focusedCell[1] + 1}. Mode: {drawMode}.
        </div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="conway-canvas"
          tabIndex={0}
          role="grid"
          aria-rowcount={DEFAULT_ROWS}
          aria-colcount={DEFAULT_COLS}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
          onKeyDown={handleCanvasKeyDown}
          style={{ cursor: drawMode === 'erase' ? 'cell' : 'crosshair' }}
          aria-label={`Conway's Game of Life grid. Focused row ${focusedCell[0] + 1}, column ${focusedCell[1] + 1}. Press arrow keys to move and ${drawMode === 'erase' ? 'Space or Enter to erase' : 'Space or Enter to draw'}.`}
        />
      </div>

      {/* Patterns */}
      <div className="conway-bar conway-bar--bottom">
        <span className="patterns-label">Patterns:</span>
        <div className="pattern-buttons">
          {PATTERNS.map((p) => (
            <button
              key={p.name}
              className="pattern-btn"
              onClick={() => handleLoadPattern(p)}
              title={`Load ${p.name}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
