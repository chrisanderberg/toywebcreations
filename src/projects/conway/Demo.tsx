import { useEffect, useMemo, useState } from "react";

const ROWS = 18;
const COLUMNS = 18;
const MIN_DELAY = 60;
const MAX_DELAY = 320;

function sliderValueToDelay(value: number): number {
  return MAX_DELAY + MIN_DELAY - value;
}

function delayToSliderValue(delay: number): number {
  return MAX_DELAY + MIN_DELAY - delay;
}

function createEmptyBoard(): boolean[] {
  return Array.from({ length: ROWS * COLUMNS }, () => false);
}

function seedPreset(name: "glider" | "pulsar" | "acorn"): boolean[] {
  const board = createEmptyBoard();

  const points: Record<typeof name, Array<[number, number]>> = {
    glider: [
      [1, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3]
    ],
    pulsar: [
      [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
      [4, 2], [5, 2], [6, 2], [4, 7], [5, 7], [6, 7], [4, 9], [5, 9], [6, 9], [4, 14], [5, 14], [6, 14],
      [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
      [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
      [10, 2], [11, 2], [12, 2], [10, 7], [11, 7], [12, 7], [10, 9], [11, 9], [12, 9], [10, 14], [11, 14], [12, 14],
      [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12]
    ],
    acorn: [
      [7, 7],
      [8, 9],
      [9, 6],
      [9, 7],
      [9, 10],
      [9, 11],
      [9, 12]
    ]
  };

  points[name].forEach(([row, column]) => {
    board[row * COLUMNS + column] = true;
  });

  return board;
}

function getNextGeneration(board: boolean[]): boolean[] {
  return board.map((alive, index) => {
    const row = Math.floor(index / COLUMNS);
    const column = index % COLUMNS;
    let neighbors = 0;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        if (rowOffset === 0 && columnOffset === 0) {
          continue;
        }

        const nextRow = row + rowOffset;
        const nextColumn = column + columnOffset;

        if (nextRow < 0 || nextRow >= ROWS || nextColumn < 0 || nextColumn >= COLUMNS) {
          continue;
        }

        if (board[nextRow * COLUMNS + nextColumn]) {
          neighbors += 1;
        }
      }
    }

    if (alive) {
      return neighbors === 2 || neighbors === 3;
    }

    return neighbors === 3;
  });
}

export default function ConwayDemo() {
  const [board, setBoard] = useState<boolean[]>(() => seedPreset("glider"));
  const [running, setRunning] = useState(false);
  const [delay, setDelay] = useState(180);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBoard((currentBoard) => getNextGeneration(currentBoard));
      setGeneration((current) => current + 1);
    }, delay);

    return () => window.clearInterval(timer);
  }, [running, delay]);

  const liveCount = useMemo(
    () => board.reduce((count, cell) => count + (cell ? 1 : 0), 0),
    [board]
  );

  function loadPreset(name: "glider" | "pulsar" | "acorn") {
    setBoard(seedPreset(name));
    setGeneration(0);
    setRunning(false);
  }

  function clearBoard() {
    setBoard(createEmptyBoard());
    setGeneration(0);
    setRunning(false);
  }

  function toggleCell(index: number) {
    setBoard((currentBoard) =>
      currentBoard.map((alive, cellIndex) => (cellIndex === index ? !alive : alive))
    );
  }

  function step() {
    setBoard((currentBoard) => getNextGeneration(currentBoard));
    setGeneration((current) => current + 1);
  }

  return (
    <div className="conway-demo">
      <div className="conway-toolbar">
        <button type="button" onClick={() => setRunning((value) => !value)} data-active={running}>
          {running ? "Pause" : "Run"}
        </button>
        <button type="button" onClick={step}>
          Step
        </button>
        <button type="button" onClick={clearBoard}>
          Clear
        </button>
        <label>
          Speed
          <input
            type="range"
            min={MIN_DELAY}
            max={MAX_DELAY}
            step="20"
            value={delayToSliderValue(delay)}
            onChange={(event) => setDelay(sliderValueToDelay(Number(event.target.value)))}
          />
        </label>
      </div>

      <div className="conway-presets">
        <button type="button" onClick={() => loadPreset("glider")}>Glider</button>
        <button type="button" onClick={() => loadPreset("pulsar")}>Pulsar</button>
        <button type="button" onClick={() => loadPreset("acorn")}>Acorn</button>
        <p>Generation {generation} · {liveCount} live cells</p>
      </div>

      <div className="conway-grid" role="grid" aria-label="Conway's Game of Life board">
        {board.map((alive, index) => {
          const row = Math.floor(index / COLUMNS) + 1;
          const column = (index % COLUMNS) + 1;

          return (
            <button
              key={index}
              type="button"
              className="conway-cell"
              data-alive={alive}
              aria-label={`Row ${row}, column ${column}, ${alive ? "alive" : "dead"}`}
              aria-pressed={alive}
              onClick={() => toggleCell(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
