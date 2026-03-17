import { useEffect, useMemo, useState, type CSSProperties } from "react";
import "./Demo.css";
import { applyMove, createInitialState, isSolved, isValidMove, optimalMoveCount, solveHanoi, type Pegs } from "./hanoi";

type DemoStatus = "ready" | "playing" | "solving" | "solved";

const DISC_OPTIONS = [3, 4, 5, 6, 7, 8];
const DEFAULT_DISC_COUNT = 5;
const SOLVE_DELAY_MS = 420;

function getStatusText(status: DemoStatus): string {
  switch (status) {
    case "playing":
      return "Manual play";
    case "solving":
      return "Auto-solving";
    case "solved":
      return "Solved";
    default:
      return "Ready";
  }
}

export default function TowerOfHanoiDemo() {
  const [discCount, setDiscCount] = useState(DEFAULT_DISC_COUNT);
  const [pegs, setPegs] = useState<Pegs>(() => createInitialState(DEFAULT_DISC_COUNT));
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [status, setStatus] = useState<DemoStatus>("ready");
  const [solutionMoves, setSolutionMoves] = useState<ReadonlyArray<readonly [number, number]>>([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [invalidPeg, setInvalidPeg] = useState<number | null>(null);

  const optimalMoves = useMemo(() => optimalMoveCount(discCount), [discCount]);
  const solved = useMemo(() => isSolved(pegs), [pegs]);

  useEffect(() => {
    if (!solved || status === "solving") {
      return;
    }

    setStatus("solved");
    setSelectedPeg(null);
  }, [solved, status]);

  useEffect(() => {
    if (invalidPeg === null) {
      return undefined;
    }

    const timer = window.setTimeout(() => setInvalidPeg(null), 360);
    return () => window.clearTimeout(timer);
  }, [invalidPeg]);

  useEffect(() => {
    if (status !== "solving") {
      return undefined;
    }

    if (solutionIndex >= solutionMoves.length) {
      setStatus("solved");
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const [from, to] = solutionMoves[solutionIndex];
      setPegs((currentPegs) => applyMove(currentPegs, from, to));
      setMoveCount((current) => current + 1);
      setSolutionIndex((current) => current + 1);
    }, SOLVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [solutionIndex, solutionMoves, status]);

  function resetPuzzle(nextDiscCount: number = discCount) {
    setDiscCount(nextDiscCount);
    setPegs(createInitialState(nextDiscCount));
    setSelectedPeg(null);
    setMoveCount(0);
    setStatus("ready");
    setSolutionMoves([]);
    setSolutionIndex(0);
    setInvalidPeg(null);
  }

  function beginAutoSolve() {
    const freshPegs = createInitialState(discCount);
    const moves = solveHanoi(discCount);

    setPegs(freshPegs);
    setSelectedPeg(null);
    setMoveCount(0);
    setSolutionMoves(moves);
    setSolutionIndex(0);
    setInvalidPeg(null);
    setStatus("solving");
  }

  function stopAutoSolve() {
    setStatus(solved ? "solved" : moveCount === 0 ? "ready" : "playing");
    setSolutionMoves([]);
    setSolutionIndex(0);
  }

  function handlePegClick(pegIndex: number) {
    if (status === "solving") {
      return;
    }

    if (selectedPeg === null) {
      if (pegs[pegIndex].length === 0) {
        setInvalidPeg(pegIndex);
        return;
      }

      setSelectedPeg(pegIndex);
      return;
    }

    if (selectedPeg === pegIndex) {
      setSelectedPeg(null);
      return;
    }

    if (!isValidMove(pegs, selectedPeg, pegIndex)) {
      setInvalidPeg(pegIndex);
      setSelectedPeg(null);
      return;
    }

    const nextPegs = applyMove(pegs, selectedPeg, pegIndex);
    const nextMoveCount = moveCount + 1;
    const nextSolved = isSolved(nextPegs);

    setPegs(nextPegs);
    setSelectedPeg(null);
    setMoveCount(nextMoveCount);
    setStatus(nextSolved ? "solved" : "playing");
  }

  return (
    <div className="hanoi-demo">
      <div className="hanoi-demo__topline">
        <div className="hanoi-demo__headline">
          <p className="hanoi-demo__eyebrow">Recursive puzzle table</p>
          <h2>Move the whole stack without breaking the size rule.</h2>
          <p>Select a peg, then choose where its top disc should land. Auto-solve restarts from the initial stack and replays the optimal sequence.</p>
        </div>

        <div className="hanoi-demo__stats" aria-live="polite">
          <div className="hanoi-demo__status">
            <span className="hanoi-demo__status-label">Status</span>
            <strong className="hanoi-demo__status-text" data-state={status}>
              {getStatusText(status)}
            </strong>
          </div>
          <div>
            <strong>
              {moveCount} / {optimalMoves}
            </strong>
            <span> moves against the optimal target</span>
          </div>
        </div>
      </div>

      <div className="hanoi-demo__controls">
        <div className="hanoi-demo__control-group">
          <label htmlFor="hanoi-disc-count">
            Discs
            <select
              id="hanoi-disc-count"
              value={discCount}
              onChange={(event) => resetPuzzle(Number(event.target.value))}
              disabled={status === "solving"}
            >
              {DISC_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="hanoi-demo__control-group">
          <button type="button" onClick={() => resetPuzzle()} disabled={status === "solving"}>
            Reset
          </button>
          {status === "solving" ? (
            <button type="button" onClick={stopAutoSolve} data-emphasis="true">
              Stop solver
            </button>
          ) : (
            <button type="button" onClick={beginAutoSolve} data-emphasis="true">
              Auto-solve
            </button>
          )}
        </div>
      </div>

      <div className="hanoi-demo__board" role="group" aria-label="Tower of Hanoi puzzle">
        {pegs.map((peg, pegIndex) => (
          <button
            key={pegIndex}
            type="button"
            className="hanoi-demo__peg"
            aria-label={`Peg ${pegIndex + 1} with ${peg.length} discs`}
            aria-disabled={status === "solving"}
            disabled={status === "solving"}
            data-selected={selectedPeg === pegIndex}
            data-invalid={invalidPeg === pegIndex}
            data-disabled={status === "solving"}
            onClick={() => handlePegClick(pegIndex)}
          >
            <span className="hanoi-demo__peg-index">Peg {pegIndex + 1}</span>
            <span className="hanoi-demo__peg-rail" aria-hidden="true"></span>
            <span className="hanoi-demo__peg-base" aria-hidden="true"></span>
            <span className="hanoi-demo__stack">
              {peg.map((disc, discIndex) => (
                <span
                  key={disc}
                  className="hanoi-demo__disc"
                  data-top-selected={selectedPeg === pegIndex && discIndex === peg.length - 1}
                  style={{ "--disc-width": `${32 + (disc / discCount) * 54}%` } as CSSProperties}
                  aria-hidden="true"
                ></span>
              ))}
            </span>
          </button>
        ))}
      </div>

      <div className="hanoi-demo__footer">
        <div>
          <p className="hanoi-demo__hint">Rules: move one disc at a time, only from the top of a peg, and never place a larger disc on a smaller one.</p>
          <p>{status === "solving" ? "The solver is replaying the classic recursive solution." : "A perfect run always takes 2^n - 1 moves, so each extra disc doubles the work and adds one."}</p>
        </div>
        {status === "solved" && (
          <div className="hanoi-demo__banner" role="status">
            Stack transferred cleanly.
          </div>
        )}
      </div>
    </div>
  );
}
