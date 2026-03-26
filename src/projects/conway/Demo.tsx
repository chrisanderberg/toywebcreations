import { useCallback, useEffect, useState } from "react";
import "./Demo.css";

const ROWS = 28;
const COLS = 40;

function emptyGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
}

function randomGrid(density: number): boolean[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() < density)
  );
}

function countNeighbors(g: boolean[][], y: number, x: number): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dy === 0 && dx === 0) continue;
      const ny = (y + dy + ROWS) % ROWS;
      const nx = (x + dx + COLS) % COLS;
      if (g[ny][nx]) n++;
    }
  }
  return n;
}

function stepGrid(prev: boolean[][]): boolean[][] {
  return prev.map((row, y) =>
    row.map((alive, x) => {
      const c = countNeighbors(prev, y, x);
      if (alive) return c === 2 || c === 3;
      return c === 3;
    })
  );
}

export default function ConwayDemo() {
  const [grid, setGrid] = useState<boolean[][]>(() => randomGrid(0.32));
  const [running, setRunning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) setRunning(false);
  }, [reduceMotion]);

  const tick = useCallback(() => {
    setGrid((g) => stepGrid(g));
  }, []);

  useEffect(() => {
    if (!running || reduceMotion) return;
    const id = window.setInterval(tick, 120);
    return () => window.clearInterval(id);
  }, [running, tick, reduceMotion]);

  const toggle = (y: number, x: number) => {
    setGrid((g) => {
      const next = g.map((row) => [...row]);
      next[y][x] = !next[y][x];
      return next;
    });
  };

  const clear = () => {
    setRunning(false);
    setGrid(emptyGrid());
  };

  const randomize = () => {
    setRunning(false);
    setGrid(randomGrid(0.28));
  };

  const stepOnce = () => {
    setRunning(false);
    tick();
  };

  return (
    <div className="life-demo">
      <p className="life-demo__hint">
        Click cells to toggle. Edges wrap (torus). Use Run for continuous generations, or Step for
        one tick at a time.
      </p>
      <div
        className="life-demo__board"
        style={{
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`
        }}
        role="grid"
        aria-label="Game of Life grid"
      >
        {grid.map((row, y) =>
          row.map((alive, x) => (
            <button
              key={`${y}-${x}`}
              type="button"
              className={`life-demo__cell${alive ? " life-demo__cell--live" : ""}`}
              aria-pressed={alive}
              onClick={() => toggle(y, x)}
            />
          ))
        )}
      </div>
      <div className="life-demo__controls">
        <button type="button" onClick={() => setRunning((r) => !r)} disabled={reduceMotion}>
          {running ? "Pause" : "Run"}
        </button>
        {reduceMotion ? (
          <span className="life-demo__note">Animation paused (reduced motion preference).</span>
        ) : null}
        <button type="button" onClick={stepOnce}>
          Step
        </button>
        <button type="button" onClick={randomize}>
          Random
        </button>
        <button type="button" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
