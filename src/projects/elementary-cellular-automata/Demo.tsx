import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generatePattern,
  ruleToMapping,
  createCenteredSeed,
  createRandomSeed,
  neighborhoodLabel,
} from './automata';
import './Demo.css';

// --- Constants ---

const CELL_PX = 4;
const GRID_WIDTH = 200;
const GRID_ROWS = 300;
const DEFAULT_RULE = 30;
const DEFAULT_DENSITY = 0.5;

const PRESET_RULES = [
  { label: 'Rule 30', value: 30 },
  { label: 'Rule 90', value: 90 },
  { label: 'Rule 110', value: 110 },
  { label: 'Rule 184', value: 184 },
];

// Retro warm palette
const COLOR_LIVE = '#D4A574';
const COLOR_DEAD = '#221C14';
const COLOR_LIVE_GLOW = 'rgba(212, 165, 116, 0.3)';

// --- Component ---

export default function ElementaryCellularAutomataDemo() {
  const [rule, setRule] = useState(DEFAULT_RULE);
  const [ruleInput, setRuleInput] = useState(String(DEFAULT_RULE));
  const [seedMode, setSeedMode] = useState<'centered' | 'random'>('centered');
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [pattern, setPattern] = useState<number[][]>(() =>
    generatePattern(createCenteredSeed(GRID_WIDTH), DEFAULT_RULE, GRID_ROWS)
  );
  const [ruleMapOpen, setRuleMapOpen] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = GRID_WIDTH * CELL_PX;
  const canvasHeight = GRID_ROWS * CELL_PX;

  // --- Generate pattern ---
  const buildPattern = useCallback(
    (r: number, mode: 'centered' | 'random', d: number) => {
      const seed =
        mode === 'centered'
          ? createCenteredSeed(GRID_WIDTH)
          : createRandomSeed(GRID_WIDTH, d);
      setPattern(generatePattern(seed, r, GRID_ROWS));
    },
    []
  );

  // Regenerate whenever rule or seed mode changes (keep stable density)
  const handleRegenerate = () => buildPattern(rule, seedMode, density);
  const handleRandomize = () => {
    const newSeed = createRandomSeed(GRID_WIDTH, density);
    setPattern(generatePattern(newSeed, rule, GRID_ROWS));
    setSeedMode('random');
  };

  // --- Rule input handling ---
  const applyRule = (value: number) => {
    const clamped = Math.max(0, Math.min(255, value));
    setRule(clamped);
    setRuleInput(String(clamped));
    buildPattern(clamped, seedMode, density);
  };

  const handleRuleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuleInput(e.target.value);
    const n = parseInt(e.target.value, 10);
    if (!isNaN(n) && n >= 0 && n <= 255) {
      setRule(n);
      buildPattern(n, seedMode, density);
    }
  };

  const handleRuleBlur = () => {
    const n = parseInt(ruleInput, 10);
    if (isNaN(n) || n < 0 || n > 255) {
      setRuleInput(String(rule));
    } else {
      applyRule(n);
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyRule(Number(e.target.value));
  };

  const handlePreset = (value: number) => {
    applyRule(value);
  };

  const handleSeedMode = (mode: 'centered' | 'random') => {
    setSeedMode(mode);
    buildPattern(rule, mode, density);
  };

  const handleDensity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = Number(e.target.value);
    setDensity(d);
    if (seedMode === 'random') {
      const newSeed = createRandomSeed(GRID_WIDTH, d);
      setPattern(generatePattern(newSeed, rule, GRID_ROWS));
    }
  };

  // --- Canvas rendering ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = COLOR_DEAD;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw live cells
    ctx.shadowColor = COLOR_LIVE_GLOW;
    ctx.shadowBlur = CELL_PX > 3 ? 3 : 0;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (!pattern[row][col]) continue;
        ctx.fillStyle = COLOR_LIVE;
        ctx.fillRect(col * CELL_PX, row * CELL_PX, CELL_PX, CELL_PX);
      }
    }

    ctx.shadowBlur = 0;
  }, [pattern, canvasWidth, canvasHeight]);

  const mapping = ruleToMapping(rule);

  return (
    <div className="eca-wrap">
      {/* Controls bar */}
      <div className="eca-bar">
        {/* Rule display + input + slider */}
        <div className="eca-rule-section">
          <span className="eca-label">Rule</span>
          <span className="eca-rule-display">{String(rule).padStart(3, ' ')}</span>
          <input
            type="number"
            min={0}
            max={255}
            value={ruleInput}
            onChange={handleRuleInput}
            onBlur={handleRuleBlur}
            className="eca-rule-input"
            aria-label="Rule number (0–255)"
          />
          <input
            type="range"
            min={0}
            max={255}
            value={rule}
            onChange={handleSlider}
            className="eca-rule-slider"
            aria-label="Rule slider"
          />
        </div>

        {/* Preset buttons */}
        <div className="eca-presets">
          {PRESET_RULES.map((p) => (
            <button
              key={p.value}
              className={`preset-btn${rule === p.value ? ' active' : ''}`}
              onClick={() => handlePreset(p.value)}
              title={`Load ${p.label}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Seed mode + actions */}
        <div className="eca-actions">
          {/* Seed mode selector */}
          <div className="eca-seed-tabs" role="group" aria-label="Initial row seed">
            <button
              className={`seed-tab${seedMode === 'centered' ? ' active' : ''}`}
              onClick={() => handleSeedMode('centered')}
            >
              Center
            </button>
            <button
              className={`seed-tab${seedMode === 'random' ? ' active' : ''}`}
              onClick={() => handleSeedMode('random')}
            >
              Random
            </button>
          </div>

          {/* Density slider, shown only in random mode */}
          {seedMode === 'random' && (
            <div className="eca-density-wrap">
              <span className="eca-label">Density</span>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.05}
                value={density}
                onChange={handleDensity}
                className="density-slider"
                aria-label="Random seed density"
              />
              <span className="density-value">{Math.round(density * 100)}%</span>
            </div>
          )}

          <button className="ctrl-btn ctrl-btn--primary" onClick={handleRegenerate}>
            ↺ Regenerate
          </button>
          <button className="ctrl-btn" onClick={handleRandomize}>
            ⚡ Randomize
          </button>
        </div>
      </div>

      {/* Rule mapping display */}
      <div className="eca-rule-map-section">
        <div
          className="eca-rule-map-header"
          onClick={() => setRuleMapOpen((o) => !o)}
          role="button"
          aria-expanded={ruleMapOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
              e.preventDefault();
              setRuleMapOpen((o) => !o);
            }
          }}
        >
          <span className="eca-rule-map-title">
            Rule {rule} — neighborhood → output mapping
          </span>
          <span className="eca-rule-map-toggle">{ruleMapOpen ? '▲ hide' : '▼ show'}</span>
        </div>

        {ruleMapOpen && (
          <div className="eca-rule-map-body" role="list" aria-label="Rule mapping">
            {mapping.map(([neighborhood, output]) => (
              <div
                key={neighborhood}
                className="eca-neighborhood"
                role="listitem"
                title={`${neighborhoodLabel(neighborhood)} → ${output}`}
              >
                {/* Three-cell neighborhood mini-preview */}
                <div className="eca-nb-pattern">
                  {neighborhoodLabel(neighborhood)
                    .split('')
                    .map((bit, i) => (
                      <div
                        key={i}
                        className={`eca-nb-cell${bit === '1' ? ' on' : ''}`}
                        aria-label={bit === '1' ? 'alive' : 'dead'}
                      />
                    ))}
                </div>
                <span className="eca-nb-arrow">↓</span>
                <div className={`eca-nb-output${output ? ' on' : ' off'}`} aria-label={output ? 'alive' : 'dead'}>
                  {output}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="eca-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="eca-canvas"
          aria-label={`1D cellular automata pattern for Rule ${rule}`}
        />
      </div>

      <p className="eca-caption">
        Rule {rule} · {GRID_WIDTH} cells wide · {GRID_ROWS} generations · fixed-zero boundaries ·{' '}
        {seedMode === 'centered' ? 'centered single-cell seed' : `random seed (${Math.round(density * 100)}% density)`}
      </p>
    </div>
  );
}
