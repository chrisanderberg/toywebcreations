import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyMove,
  createInitialState,
  isSolved,
  isValidMove,
  optimalMoveCount,
  solveHanoi,
  type Pegs
} from "./hanoi";
import "./Demo.css";

type Status = "ready" | "playing" | "solving" | "solving_paused" | "solved";

const DISC_MIN = 3;
const DISC_MAX = 8;
const SOLVE_MS = 520;

export default function TowerOfHanoiDemo() {
  const [discCount, setDiscCount] = useState(4);
  const [pegs, setPegs] = useState<Pegs>(() => createInitialState(4));
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [status, setStatus] = useState<Status>("ready");
  const [solutionMoves, setSolutionMoves] = useState<[number, number][]>([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movesRef = useRef<[number, number][]>([]);
  const stepRef = useRef(0);

  const optimal = optimalMoveCount(discCount);
  const solved = isSolved(pegs);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetPuzzle = useCallback(
    (n: number) => {
      clearTimer();
      movesRef.current = [];
      stepRef.current = 0;
      setPegs(createInitialState(n));
      setSelectedPeg(null);
      setMoveCount(0);
      setStatus("ready");
      setSolutionMoves([]);
      setSolutionIndex(0);
    },
    [clearTimer]
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (solved && status !== "solving") {
      setStatus((s) => (s === "solving_paused" ? s : "solved"));
    }
  }, [solved, status]);

  const tickSolve = useCallback(() => {
    const moves = movesRef.current;
    const i = stepRef.current;
    if (i >= moves.length) {
      clearTimer();
      setStatus("solved");
      return;
    }
    const [from, to] = moves[i]!;
    setPegs((p) => applyMove(p, from, to));
    setMoveCount((c) => c + 1);
    const next = i + 1;
    stepRef.current = next;
    setSolutionIndex(next);
    if (next >= moves.length) {
      clearTimer();
      setStatus("solved");
    }
  }, [clearTimer]);

  const startSolveTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(tickSolve, SOLVE_MS);
  }, [clearTimer, tickSolve]);

  const handleDiscCount = (n: number) => {
    const v = Math.max(DISC_MIN, Math.min(DISC_MAX, n));
    setDiscCount(v);
    resetPuzzle(v);
  };

  const solveInProgress = status === "solving" || status === "solving_paused";

  const onPegClick = (pegIndex: number) => {
    if (solveInProgress) return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length > 0) {
        setSelectedPeg(pegIndex);
        setStatus("playing");
      }
      return;
    }

    if (selectedPeg === pegIndex) {
      setSelectedPeg(null);
      return;
    }

    if (isValidMove(pegs, selectedPeg, pegIndex)) {
      const next = applyMove(pegs, selectedPeg, pegIndex);
      setPegs(next);
      setMoveCount((c) => c + 1);
      setSelectedPeg(null);
      setStatus(isSolved(next) ? "solved" : "playing");
    } else {
      setSelectedPeg(null);
    }
  };

  const startAutoSolve = () => {
    clearTimer();
    const moves = solveHanoi(discCount);
    movesRef.current = moves;
    stepRef.current = 0;
    setPegs(createInitialState(discCount));
    setSelectedPeg(null);
    setMoveCount(0);
    setSolutionMoves(moves);
    setSolutionIndex(0);
    setStatus("solving");
    startSolveTimer();
  };

  const pauseSolve = () => {
    if (status !== "solving") return;
    clearTimer();
    setStatus("solving_paused");
  };

  const resumeSolve = () => {
    if (status !== "solving_paused") return;
    setStatus("solving");
    startSolveTimer();
  };

  const stopSolve = () => {
    clearTimer();
    movesRef.current = [];
    stepRef.current = 0;
    setSolutionMoves([]);
    setSolutionIndex(0);
    setStatus(pegs.some((p) => p.length > 0) ? "playing" : "ready");
  };

  return (
    <div className="hanoi-demo">
      <p className="hanoi-demo__hint">
        Click a peg to pick up its top disc, then another peg to drop it. Only smaller discs may sit
        on larger ones.
      </p>

      <div className="hanoi-demo__toolbar">
        <label className="hanoi-demo__field">
          <span id="disc-label">Discs</span>
          <select
            aria-labelledby="disc-label"
            value={discCount}
            onChange={(e) => handleDiscCount(Number(e.target.value))}
            disabled={solveInProgress}
          >
            {Array.from({ length: DISC_MAX - DISC_MIN + 1 }, (_, i) => DISC_MIN + i).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="hanoi-demo__btn"
          onClick={() => resetPuzzle(discCount)}
          disabled={solveInProgress}
        >
          Reset
        </button>
        <button type="button" className="hanoi-demo__btn" onClick={startAutoSolve} disabled={solveInProgress}>
          Auto-solve
        </button>
        {status === "solving" ? (
          <button type="button" className="hanoi-demo__btn" onClick={pauseSolve}>
            Pause
          </button>
        ) : null}
        {status === "solving_paused" ? (
          <button type="button" className="hanoi-demo__btn" onClick={resumeSolve}>
            Resume
          </button>
        ) : null}
        {(status === "solving_paused" || (solutionMoves.length > 0 && status !== "solving")) && status !== "solved" ? (
          <button type="button" className="hanoi-demo__btn" onClick={stopSolve}>
            Stop solve
          </button>
        ) : null}
      </div>

      <div className="hanoi-demo__status" role="status">
        <span>
          Moves: {moveCount} / {optimal} optimal
        </span>
        <span className="hanoi-demo__badge">
          {status === "ready" && "Ready"}
          {status === "playing" && "Playing"}
          {status === "solving" && "Solving…"}
          {status === "solving_paused" && "Paused"}
          {status === "solved" && "Solved"}
        </span>
      </div>

      {status === "solved" ? (
        <p className="hanoi-demo__win" role="alert">
          All discs reached the goal peg.
        </p>
      ) : null}

      <div className="hanoi-demo__pegs" role="group" aria-label="Three pegs">
        {[0, 1, 2].map((pegIndex) => (
          <button
            key={pegIndex}
            type="button"
            className={`hanoi-demo__peg${selectedPeg === pegIndex ? " hanoi-demo__peg--selected" : ""}`}
            onClick={() => onPegClick(pegIndex)}
            disabled={solveInProgress}
            aria-label={`Peg ${pegIndex + 1}, ${pegs[pegIndex].length} discs`}
            aria-pressed={selectedPeg === pegIndex}
          >
            <div className="hanoi-demo__peg-rod" aria-hidden="true" />
            <div className="hanoi-demo__disc-stack">
              {pegs[pegIndex].map((disc, stackIdx) => {
                const wPct = 38 + ((discCount - disc) / discCount) * 52;
                return (
                  <div
                    key={`${pegIndex}-${stackIdx}-${disc}`}
                    className="hanoi-demo__disc"
                    style={{ width: `${wPct}%` }}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
            <div className="hanoi-demo__peg-base" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
