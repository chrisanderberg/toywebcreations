import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyMove,
  createInitialState,
  isSolved,
  isValidMove,
  optimalMoveCount,
  solveHanoi,
  type Pegs,
} from './hanoi';
import './Demo.css';

const DISC_MIN = 3;
const DISC_MAX = 8;
const SOLVE_MS = 520;

type Status = 'ready' | 'playing' | 'solving' | 'solved';

function discWidthPercent(discId: number, n: number): number {
  const rank = n - discId;
  return 32 + (rank / n) * 62;
}

export default function TowerOfHanoiDemo() {
  const [discCount, setDiscCount] = useState(4);
  const [pegs, setPegs] = useState<Pegs>(() => createInitialState(4));
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [status, setStatus] = useState<Status>('ready');
  const [shakePeg, setShakePeg] = useState<number | null>(null);
  const solveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const optimal = optimalMoveCount(discCount);

  const clearSolveTimer = useCallback(() => {
    if (solveTimerRef.current != null) {
      clearInterval(solveTimerRef.current);
      solveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearSolveTimer();
  }, [clearSolveTimer]);

  useEffect(() => {
    if (isSolved(pegs)) {
      setStatus((s) => (s === 'solving' || s === 'playing' || s === 'ready' ? 'solved' : s));
    } else {
      setStatus((s) => (s === 'solved' ? 'playing' : s));
    }
  }, [pegs]);

  const reset = useCallback(
    (n: number) => {
      clearSolveTimer();
      setDiscCount(n);
      setPegs(createInitialState(n));
      setSelectedPeg(null);
      setMoveCount(0);
      setStatus('ready');
    },
    [clearSolveTimer],
  );

  const onDiscCountChange = (n: number) => {
    if (n < DISC_MIN || n > DISC_MAX) return;
    reset(n);
  };

  const triggerShake = (peg: number) => {
    setShakePeg(peg);
    window.setTimeout(() => setShakePeg(null), 400);
  };

  const onPegClick = (pegIndex: number) => {
    if (status === 'solving') return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length === 0) return;
      setSelectedPeg(pegIndex);
      setStatus('playing');
      return;
    }

    if (selectedPeg === pegIndex) {
      setSelectedPeg(null);
      return;
    }

    if (!isValidMove(pegs, selectedPeg, pegIndex)) {
      triggerShake(pegIndex);
      setSelectedPeg(null);
      return;
    }

    setPegs((p) => applyMove(p, selectedPeg, pegIndex));
    setMoveCount((c) => c + 1);
    setSelectedPeg(null);
    setStatus('playing');
  };

  const startAutoSolve = () => {
    if (status === 'solving') return;
    clearSolveTimer();
    const moves = solveHanoi(discCount, 0, 2, 1);
    setPegs(createInitialState(discCount));
    setMoveCount(0);
    setSelectedPeg(null);
    setStatus('solving');

    let i = 0;
    solveTimerRef.current = setInterval(() => {
      if (i >= moves.length) {
        clearSolveTimer();
        setStatus('solved');
        return;
      }
      const [from, to] = moves[i];
      setPegs((p) => applyMove(p, from, to));
      setMoveCount((c) => c + 1);
      i++;
    }, SOLVE_MS);
  };

  const pauseSolve = () => {
    clearSolveTimer();
    setStatus(isSolved(pegs) ? 'solved' : 'playing');
  };

  const solved = isSolved(pegs);

  return (
    <div className="hanoi-demo">
      <div className="hanoi-demo__toolbar">
        <span className="hanoi-demo__label" id="hanoi-disc-label">
          Discs
        </span>
        <select
          className="hanoi-demo__select"
          aria-labelledby="hanoi-disc-label"
          value={discCount}
          onChange={(e) => onDiscCountChange(Number(e.target.value))}
          disabled={status === 'solving'}
        >
          {Array.from({ length: DISC_MAX - DISC_MIN + 1 }, (_, i) => DISC_MIN + i).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="hanoi-demo__btn"
          onClick={() => reset(discCount)}
          disabled={status === 'solving'}
        >
          Reset
        </button>
        {status !== 'solving' ? (
          <button type="button" className="hanoi-demo__btn" onClick={startAutoSolve}>
            Auto-solve
          </button>
        ) : (
          <button type="button" className="hanoi-demo__btn hanoi-demo__btn--active" onClick={pauseSolve}>
            Stop
          </button>
        )}
      </div>

      <div className="hanoi-demo__status" aria-live="polite">
        <span>
          Moves: <strong>{moveCount}</strong> / <strong>{optimal}</strong> optimal
        </span>
        <span>
          Status:{' '}
          <strong>
            {status === 'ready' && 'Ready'}
            {status === 'playing' && 'Playing'}
            {status === 'solving' && 'Solving'}
            {status === 'solved' && 'Solved'}
          </strong>
        </span>
      </div>

      {solved ? <p className="hanoi-demo__win">All discs reached the right peg. Well done.</p> : null}

      <p className="hanoi-demo__hint">
        Tap a peg to pick up its top disc, then another peg to place it. Only smaller discs may sit
        on larger ones. Auto-solve replays a minimal {optimal}-move solution.
      </p>

      <div className="hanoi-demo__pegs" role="group" aria-label="Three pegs">
        {([0, 1, 2] as const).map((pegIndex) => {
          const stack = pegs[pegIndex];
          const selectedHere = selectedPeg === pegIndex;
          const top = stack.length ? stack[stack.length - 1] : null;
          const showLifted = selectedHere && top !== null;

          return (
            <div key={pegIndex} className="hanoi-demo__peg-wrap">
              <button
                type="button"
                className={[
                  'hanoi-demo__peg',
                  selectedHere ? 'hanoi-demo__peg--selected' : '',
                  shakePeg === pegIndex ? 'hanoi-demo__peg--shake' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onPegClick(pegIndex)}
                aria-label={
                  stack.length === 0
                    ? `Peg ${pegIndex + 1}, empty`
                    : `Peg ${pegIndex + 1}, ${stack.length} disc(s). Top disc size ${top! + 1}.`
                }
              >
                <div className="hanoi-demo__peg-stem" aria-hidden="true" />
                <div className="hanoi-demo__stack">
                  {stack.map((discId, idx) => {
                    const isTop = idx === stack.length - 1;
                    if (showLifted && isTop) return null;
                    return (
                      <div
                        key={`${pegIndex}-${idx}-${discId}`}
                        className="hanoi-demo__disc"
                        style={{ width: `${discWidthPercent(discId, discCount)}%` }}
                        aria-hidden="true"
                      />
                    );
                  })}
                  {showLifted ? (
                    <div
                      className="hanoi-demo__disc"
                      style={{
                        width: `${discWidthPercent(top!, discCount)}%`,
                        marginBottom: '0.35rem',
                        transform: 'translateY(-0.6rem)',
                        boxShadow: 'var(--shadow-glow-md)',
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <div className="hanoi-demo__peg-base" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
