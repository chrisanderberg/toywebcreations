import { useState, useEffect, useRef } from 'react';
import {
  createInitialState,
  optimalMoveCount,
  isValidMove,
  applyMove,
  isSolved,
  solveHanoi,
} from './hanoi';
import type { Pegs } from './hanoi';
import './Demo.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_DISCS = 3;
const MAX_DISCS = 8;

const SPEEDS = [
  { label: 'Slow', ms: 900 },
  { label: 'Normal', ms: 400 },
  { label: 'Fast', ms: 100 },
] as const;

type Status = 'ready' | 'playing' | 'solving' | 'paused' | 'solved';

const PEG_LABELS = ['A', 'B', 'C'] as const;

// ─── Visual helpers ────────────────────────────────────────────────────────────

/** Disc width as % of peg zone: largest=88%, smallest=18% */
function discWidth(size: number, n: number): number {
  if (n <= 1) return 54;
  const t = (size - 1) / (n - 1); // 0=smallest, 1=largest
  return Math.round(18 + t * 70);
}

/** Inline colors interpolated from bright (smallest) to dim (largest) */
function discColors(size: number, n: number) {
  const t = n > 1 ? (size - 1) / (n - 1) : 0.5; // 0=smallest, 1=largest
  const sat = Math.round(90 - t * 20);
  const bgL = Math.round(46 - t * 30);
  const bdrL = Math.round(60 - t * 30);
  return {
    bg: `hsl(115, ${sat}%, ${bgL}%)`,
    border: `hsl(115, 100%, ${bdrL}%)`,
    liftedGlow: `0 0 18px hsla(115, 100%, 65%, 0.75), 0 0 6px hsla(115, 100%, 80%, 0.9)`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TowerOfHanoiDemo() {
  const [discCount, setDiscCount] = useState(4);
  const [pegs, setPegs] = useState<Pegs>(() => createInitialState(4));
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [status, setStatus] = useState<Status>('ready');
  const [invalidPeg, setInvalidPeg] = useState<number | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [solveProgress, setSolveProgress] = useState(0);

  // Refs for interval-safe access
  const pegsRef = useRef<Pegs>(pegs);
  const solutionRef = useRef<[number, number][]>([]);
  const solveIdxRef = useRef(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMovedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pegsRef.current = pegs;
  }, [pegs]);

  // ── Auto-solve interval ──────────────────────────────────────────────────────

  useEffect(() => {
    if (status !== 'solving') return;

    intervalIdRef.current = setInterval(() => {
      const idx = solveIdxRef.current;
      const solution = solutionRef.current;

      if (idx >= solution.length) {
        clearInterval(intervalIdRef.current!);
        intervalIdRef.current = null;
        setStatus('solved');
        return;
      }

      const [from, to] = solution[idx];
      setPegs((prev) => applyMove(prev, from, to));
      setMoveCount(idx + 1);
      setSolveProgress(idx + 1);
      solveIdxRef.current = idx + 1;

      if (idx + 1 === solution.length) {
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        setStatus('solved');
      }
    }, SPEEDS[speedIdx].ms);

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [status, speedIdx]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) clearInterval(intervalIdRef.current);
      if (lastMovedTimeoutRef.current !== null) clearTimeout(lastMovedTimeoutRef.current);
      if (shakeTimeoutRef.current !== null) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function resetAll(n: number = discCount) {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    solutionRef.current = [];
    solveIdxRef.current = 0;
    setPegs(createInitialState(n));
    setSelectedPeg(null);
    setMoveCount(0);
    setStatus('ready');
    setSolveProgress(0);
    setInvalidPeg(null);
  }

  function applyStepFromSolution() {
    const idx = solveIdxRef.current;
    const solution = solutionRef.current;
    if (idx >= solution.length) {
      setStatus('solved');
      return;
    }
    const [from, to] = solution[idx];
    setPegs((prev) => applyMove(prev, from, to));
    setMoveCount(idx + 1);
    setSolveProgress(idx + 1);
    solveIdxRef.current = idx + 1;
    if (idx + 1 >= solution.length) setStatus('solved');
  }

  // ── Event handlers ───────────────────────────────────────────────────────────

  function handleDiscCountChange(n: number) {
    setDiscCount(n);
    resetAll(n);
  }

  function handleAutoSolve() {
    const solution = solveHanoi(discCount);
    solutionRef.current = solution;
    solveIdxRef.current = 0;
    setPegs(createInitialState(discCount));
    setMoveCount(0);
    setSelectedPeg(null);
    setSolveProgress(0);
    setStatus('solving');
  }

  function handlePauseResume() {
    if (status === 'solving') setStatus('paused');
    else if (status === 'paused') setStatus('solving');
  }

  function handleStep() {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (lastMovedTimeoutRef.current !== null) {
      clearTimeout(lastMovedTimeoutRef.current);
    }
    if (status === 'solving') setStatus('paused');
    // Apply move on next tick so paused status takes effect first
    lastMovedTimeoutRef.current = setTimeout(() => {
      applyStepFromSolution();
      lastMovedTimeoutRef.current = null;
    }, 0);
  }

  function handlePegClick(pegIdx: number) {
    if (status === 'paused' || status === 'solving' || status === 'solved') return;

    if (selectedPeg === null) {
      if (pegs[pegIdx].length > 0) setSelectedPeg(pegIdx);
    } else if (selectedPeg === pegIdx) {
      setSelectedPeg(null);
    } else {
      if (isValidMove(pegs, selectedPeg, pegIdx)) {
        const newPegs = applyMove(pegs, selectedPeg, pegIdx);
        setPegs(newPegs);
        setMoveCount((c) => c + 1);
        setSelectedPeg(null);
        if (status === 'ready') setStatus('playing');
        if (isSolved(newPegs, discCount)) setStatus('solved');
      } else {
        // Invalid move — brief shake on target peg
        setInvalidPeg(pegIdx);
        setSelectedPeg(null);
        if (shakeTimeoutRef.current !== null) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => setInvalidPeg(null), 500);
      }
    }
  }

  // ── Derived state ────────────────────────────────────────────────────────────

  const optimal = optimalMoveCount(discCount);
  const solveTotal = solutionRef.current.length;
  const isSolveActive = status === 'solving' || status === 'paused';
  const isInteractive = status === 'ready' || status === 'playing';

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="hanoi-wrap">

      {/* ── Status bar ── */}
      <div className="hanoi-topbar">
        <div className="hanoi-stats">
          <div className="stat-block">
            <span className="stat-lbl">MOVES</span>
            <span className="stat-num">{moveCount}</span>
          </div>
          <span className="stat-sep">/</span>
          <div className="stat-block">
            <span className="stat-lbl">OPTIMAL</span>
            <span className="stat-num stat-num--dim">{optimal}</span>
          </div>
        </div>

        <div className={`status-badge status-badge--${status}`}>
          {status === 'ready'   && 'READY'}
          {status === 'playing' && 'PLAYING'}
          {status === 'solving' && 'AUTO-SOLVING'}
          {status === 'paused'  && 'PAUSED'}
          {status === 'solved'  && '✓ SOLVED'}
        </div>

        {isSolveActive && solveTotal > 0 && (
          <div className="solve-track">
            <div
              className="solve-fill"
              style={{ width: `${(solveProgress / solveTotal) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Hint ── */}
      {status === 'ready' && (
        <p className="hanoi-hint">
          Click a peg to pick up its top disc, then click another peg to place it.
        </p>
      )}

      {/* ── Puzzle stage ── */}
      <div className="hanoi-stage" role="group" aria-label="Tower of Hanoi puzzle">
        {([0, 1, 2] as const).map((pegIdx) => {
          const isSelected = selectedPeg === pegIdx;
          const isInvalid = invalidPeg === pegIdx;
          const canSelect =
            isInteractive &&
            selectedPeg === null &&
            pegs[pegIdx].length > 0;
          const canTarget =
            isInteractive &&
            selectedPeg !== null &&
            selectedPeg !== pegIdx &&
            isValidMove(pegs, selectedPeg, pegIdx);

          const pegDiscCount = pegs[pegIdx].length;

          return (
            <div
              key={pegIdx}
              className={[
                'peg-zone',
                isSelected  ? 'peg-zone--selected'   : '',
                isInvalid   ? 'peg-zone--invalid'    : '',
                canTarget   ? 'peg-zone--target'     : '',
                canSelect && !canTarget ? 'peg-zone--selectable' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handlePegClick(pegIdx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePegClick(pegIdx);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Peg ${PEG_LABELS[pegIdx]}: ${pegDiscCount === 0 ? 'empty' : `${pegDiscCount} disc${pegDiscCount !== 1 ? 's' : ''}`}${isSelected ? ', selected' : ''}`}
              aria-pressed={isSelected}
            >
              <div className="disc-area">
                <div className="peg-stem" />
                <div className="disc-stack">
                  {pegs[pegIdx].map((discSize, i) => {
                    const isTopDisc = i === pegs[pegIdx].length - 1;
                    const isLifted = isSelected && isTopDisc;
                    const colors = discColors(discSize, discCount);
                    const width = discWidth(discSize, discCount);

                    return (
                      <div
                        key={discSize}
                        className={['disc', isLifted ? 'disc--lifted' : ''].filter(Boolean).join(' ')}
                        style={{
                          width: `${width}%`,
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                          boxShadow: isLifted ? colors.liftedGlow : undefined,
                        }}
                        aria-label={`Disc ${discSize}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="peg-base" />
              <div className="peg-label">{PEG_LABELS[pegIdx]}</div>
            </div>
          );
        })}
      </div>

      {/* ── Win banner ── */}
      {status === 'solved' && (
        <div className="hanoi-win-banner">
          <span className="win-icon">✓</span>
          <span className="win-text">SOLVED</span>
          <span className="win-detail">
            {moveCount} move{moveCount !== 1 ? 's' : ''}
            {moveCount === optimal
              ? ' — optimal!'
              : ` (optimal: ${optimal})`}
          </span>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="hanoi-controls">
        <div className="controls-col controls-col--left">
          <div className="control-group">
            <span className="ctrl-lbl">DISCS</span>
            <div className="disc-count-row">
              {Array.from({ length: MAX_DISCS - MIN_DISCS + 1 }, (_, i) => MIN_DISCS + i).map((n) => (
                <button
                  key={n}
                  className={['disc-btn', discCount === n ? 'disc-btn--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => handleDiscCountChange(n)}
                  aria-label={`${n} discs`}
                  aria-pressed={discCount === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button className="action-btn action-btn--reset" onClick={() => resetAll()}>
            Reset
          </button>
        </div>

        <div className="controls-col controls-col--right">
          <div className="control-group">
            <span className="ctrl-lbl">SPEED</span>
            <div className="speed-row">
              {SPEEDS.map((s, i) => (
                <button
                  key={s.label}
                  className={['speed-btn', speedIdx === i ? 'speed-btn--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => setSpeedIdx(i)}
                  aria-pressed={speedIdx === i}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {!isSolveActive ? (
            <button
              className="action-btn action-btn--solve"
              onClick={handleAutoSolve}
              disabled={status === 'solved'}
            >
              Auto-Solve
            </button>
          ) : (
            <div className="solve-btn-group">
              <button
                className={['action-btn action-btn--pause', status === 'paused' ? 'active' : ''].filter(Boolean).join(' ')}
                onClick={handlePauseResume}
              >
                {status === 'solving' ? 'Pause' : 'Resume'}
              </button>
              <button
                className="action-btn action-btn--step"
                onClick={handleStep}
              >
                Step
              </button>
              <button className="action-btn action-btn--stop" onClick={() => resetAll()}>
                Stop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
