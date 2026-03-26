import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createCenteredSeed,
  createRandomSeed,
  generatePattern,
  neighborhoodLabel,
  ruleToMapping,
} from './automata';
import './Demo.css';

const COLS = 101;
const ROWS = 240;
const CELL = 3;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

const PRESETS = [
  { label: '30', value: 30 },
  { label: '90', value: 90 },
  { label: '110', value: 110 },
  { label: '184', value: 184 },
] as const;

type SeedMode = 'centered' | 'random';

export default function ElementaryCellularAutomataDemo() {
  const [rule, setRule] = useState(30);
  const [seedMode, setSeedMode] = useState<SeedMode>('centered');
  const [density, setDensity] = useState(0.38);
  const [regenKey, setRegenKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clampedRule = Math.min(255, Math.max(0, Math.round(rule)));

  const initialRow = useMemo(() => {
    if (seedMode === 'centered') return createCenteredSeed(COLS);
    return createRandomSeed(COLS, density);
  }, [seedMode, density, regenKey]);

  const pattern = useMemo(
    () => generatePattern(initialRow, clampedRule, ROWS),
    [initialRow, clampedRule],
  );

  const mapping = useMemo(() => ruleToMapping(clampedRule), [clampedRule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060a08';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    for (let y = 0; y < pattern.length; y++) {
      const row = pattern[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x]) {
          ctx.fillStyle = 'rgba(61, 255, 154, 0.92)';
          ctx.fillRect(x * CELL, y * CELL, CELL - 0.5, CELL - 0.5);
        }
      }
    }
  }, [pattern]);

  const onRuleInput = (v: string) => {
    const n = Number.parseInt(v, 10);
    if (Number.isNaN(n)) {
      setRule(0);
      return;
    }
    setRule(Math.min(255, Math.max(0, n)));
  };

  return (
    <div className="eca-demo">
      <div className="eca-demo__toolbar">
        <div className="eca-demo__rule-group">
          <span className="eca-demo__label" id="eca-rule-label">
            Rule
          </span>
          <input
            id="eca-rule-number"
            className="eca-demo__rule-input"
            type="number"
            min={0}
            max={255}
            value={clampedRule}
            onChange={(e) => onRuleInput(e.target.value)}
            aria-labelledby="eca-rule-label"
          />
          <input
            className="eca-demo__slider"
            type="range"
            min={0}
            max={255}
            value={clampedRule}
            onChange={(e) => setRule(Number(e.target.value))}
            aria-label="Rule 0 to 255"
          />
        </div>
        <button type="button" className="eca-demo__btn" onClick={() => setRegenKey((k) => k + 1)}>
          Regenerate
        </button>
        <button
          type="button"
          className="eca-demo__btn"
          onClick={() => {
            setSeedMode('random');
            setRegenKey((k) => k + 1);
          }}
        >
          Randomize
        </button>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            className="eca-demo__btn eca-demo__btn--preset"
            onClick={() => setRule(p.value)}
          >
            Rule {p.label}
          </button>
        ))}
      </div>

      <div className="eca-demo__seed">
        <span className="eca-demo__label">Initial row</span>
        <div className="eca-demo__seed-toggle" role="group" aria-label="Seed mode">
          <button
            type="button"
            aria-pressed={seedMode === 'centered'}
            onClick={() => {
              setSeedMode('centered');
              setRegenKey((k) => k + 1);
            }}
          >
            Centered
          </button>
          <button
            type="button"
            aria-pressed={seedMode === 'random'}
            onClick={() => {
              setSeedMode('random');
              setRegenKey((k) => k + 1);
            }}
          >
            Random
          </button>
        </div>
        {seedMode === 'random' ? (
          <div className="eca-demo__density">
            <span className="eca-demo__label">Density</span>
            <input
              type="range"
              min={0.05}
              max={0.65}
              step={0.01}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              aria-label="Random seed density"
            />
            <span className="eca-demo__label">{Math.round(density * 100)}%</span>
          </div>
        ) : null}
      </div>

      <div className="eca-demo__mapping">
        <p className="eca-demo__mapping-title">Neighborhood → next cell</p>
        <div className="eca-demo__mapping-grid">
          {mapping.map(([n, out]) => (
            <span key={n}>
              <strong>{neighborhoodLabel(n)}</strong> → {out}
            </span>
          ))}
        </div>
      </div>

      <div className="eca-demo__canvas-wrap">
        <canvas
          ref={canvasRef}
          className="eca-demo__canvas"
          width={CANVAS_W}
          height={CANVAS_H}
          role="img"
          aria-label={`Elementary automaton rule ${clampedRule}, ${ROWS} generations.`}
        />
      </div>

      <p className="eca-demo__hint">
        Each row is one generation. The next row is built by looking at triples (left, center, right)
        on the row above; outside the grid counts as 0. Rule {clampedRule} is the 8-bit truth table
        for neighborhoods 111 down to 000.
      </p>
    </div>
  );
}
