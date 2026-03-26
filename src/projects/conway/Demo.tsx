import { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';

const W = 48;
const H = 48;
const CELL = 10;
const CANVAS_W = W * CELL;
const CANVAS_H = H * CELL;

function makeEmpty(): boolean[][] {
  return Array.from({ length: H }, () => Array.from({ length: W }, () => false));
}

function randomFill(density = 0.22): boolean[][] {
  return Array.from({ length: H }, () =>
    Array.from({ length: W }, () => Math.random() < density),
  );
}

function countNeighbors(g: boolean[][], x: number, y: number): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + W) % W;
      const ny = (y + dy + H) % H;
      if (g[ny][nx]) n++;
    }
  }
  return n;
}

function stepGrid(prev: boolean[][]): boolean[][] {
  return prev.map((row, y) =>
    row.map((alive, x) => {
      const c = countNeighbors(prev, x, y);
      if (alive) return c === 2 || c === 3;
      return c === 3;
    }),
  );
}

export default function ConwayDemo() {
  const [grid, setGrid] = useState<boolean[][]>(() => randomFill(0.2));
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((g: boolean[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#060a08';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'rgba(61, 255, 154, 0.92)';
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (g[y][x]) {
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    }
    ctx.strokeStyle = 'rgba(61, 255, 154, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= W; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, CANVAS_H);
      ctx.stroke();
    }
    for (let j = 0; j <= H; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL);
      ctx.lineTo(CANVAS_W, j * CELL);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    draw(grid);
  }, [grid, draw]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= 80) {
        last = now;
        setGrid((g) => stepGrid(g));
        setGeneration((g) => g + 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL);
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[y][x] = !next[y][x];
      return next;
    });
  };

  const clear = () => {
    setRunning(false);
    setGrid(makeEmpty());
    setGeneration(0);
  };

  const randomize = () => {
    setRunning(false);
    setGrid(randomFill(0.22));
    setGeneration(0);
  };

  const stepOnce = () => {
    setRunning(false);
    setGrid((g) => stepGrid(g));
    setGeneration((g) => g + 1);
  };

  return (
    <div className="conway-demo">
      <div className="conway-demo__toolbar">
        <button
          type="button"
          className={`conway-demo__btn${running ? ' conway-demo__btn--active' : ''}`}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="conway-demo__btn" onClick={stepOnce} disabled={running}>
          Step
        </button>
        <button type="button" className="conway-demo__btn" onClick={randomize}>
          Randomize
        </button>
        <button type="button" className="conway-demo__btn" onClick={clear}>
          Clear
        </button>
      </div>
      <p className="conway-demo__hint">
        Toroidal grid: edges wrap. Click cells to toggle when paused. Conway rules: survive with 2–3
        neighbors, birth with exactly 3.
      </p>
      <div className="conway-demo__canvas-wrap">
        <canvas
          ref={canvasRef}
          className="conway-demo__canvas"
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={onCanvasClick}
          role="img"
          aria-label="Game of Life grid. Click to toggle cells when paused."
        />
      </div>
      <p className="conway-demo__meta">Generation: {generation} · {W}×{H} cells</p>
    </div>
  );
}
