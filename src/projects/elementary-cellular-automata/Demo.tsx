import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCenteredSeed,
  createRandomSeed,
  generatePattern,
  ruleToMapping
} from "./automata";
import "./Demo.css";

const WIDTH = 101;
const NUM_ROWS = 240;

const PRESETS: { label: string; rule: number }[] = [
  { label: "30", rule: 30 },
  { label: "90", rule: 90 },
  { label: "110", rule: 110 },
  { label: "184", rule: 184 }
];

export default function ElementaryCellularAutomataDemo() {
  const [rule, setRule] = useState(30);
  const [seedMode, setSeedMode] = useState<"centered" | "random">("centered");
  const [density, setDensity] = useState(0.35);
  const [pattern, setPattern] = useState<number[][]>(() =>
    generatePattern(createCenteredSeed(WIDTH), 30, NUM_ROWS)
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapping = useMemo(() => ruleToMapping(rule), [rule]);

  const recompute = useCallback(
    (r: number, mode: "centered" | "random", d: number) => {
      const seed =
        mode === "centered" ? createCenteredSeed(WIDTH) : createRandomSeed(WIDTH, d);
      setPattern(generatePattern(seed, r, NUM_ROWS));
    },
    []
  );

  useEffect(() => {
    recompute(rule, seedMode, density);
  }, [rule, seedMode, density, recompute]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = pattern.length;
    const cols = pattern[0]?.length ?? WIDTH;
    const cell = Math.max(1, Math.floor(800 / cols));
    const ch = Math.min(cell, Math.max(1, Math.floor(420 / rows)));

    canvas.width = cols * cell;
    canvas.height = rows * ch;

    ctx.fillStyle = "#111916";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      const row = pattern[y]!;
      for (let x = 0; x < cols; x++) {
        if (row[x]) {
          ctx.fillStyle = "#3dff8a";
          ctx.shadowColor = "rgba(61, 255, 138, 0.5)";
          ctx.shadowBlur = 4;
          ctx.fillRect(x * cell, y * ch, cell - (cell > 1 ? 1 : 0), ch - (ch > 1 ? 1 : 0));
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [pattern]);

  const clampRule = (n: number) => Math.max(0, Math.min(255, Math.floor(n)));

  return (
    <div className="eca-demo">
      <p className="eca-demo__hint">
        Elementary automata use the row above and a fixed rule to color each cell. Edges pretend
        neighbors outside the grid are off (0).
      </p>

      <div className="eca-demo__controls">
        <label className="eca-demo__field">
          <span>Rule (0–255)</span>
          <input
            type="number"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => setRule(clampRule(Number(e.target.value)))}
            aria-label="Rule number"
          />
        </label>
        <label className="eca-demo__field eca-demo__field--grow">
          <span>Rule slider</span>
          <input
            type="range"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => setRule(Number(e.target.value))}
            aria-label="Rule slider"
          />
        </label>
        <div className="eca-demo__presets">
          {PRESETS.map((p) => (
            <button key={p.rule} type="button" className="eca-demo__btn" onClick={() => setRule(p.rule)}>
              Rule {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eca-demo__seed">
        <span className="eca-demo__label">Seed</span>
        <div className="eca-demo__seed-btns" role="group" aria-label="Seed mode">
          <button
            type="button"
            className={`eca-demo__btn${seedMode === "centered" ? " eca-demo__btn--active" : ""}`}
            onClick={() => setSeedMode("centered")}
          >
            Centered cell
          </button>
          <button
            type="button"
            className={`eca-demo__btn${seedMode === "random" ? " eca-demo__btn--active" : ""}`}
            onClick={() => setSeedMode("random")}
          >
            Random
          </button>
        </div>
        {seedMode === "random" ? (
          <label className="eca-demo__field eca-demo__field--grow">
            <span>Density</span>
            <input
              type="range"
              min={0.05}
              max={0.95}
              step={0.05}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              aria-label="Random seed density"
            />
          </label>
        ) : null}
        <button type="button" className="eca-demo__btn" onClick={() => recompute(rule, seedMode, density)}>
          Regenerate
        </button>
        <button
          type="button"
          className="eca-demo__btn"
          onClick={() => {
            if (seedMode === "random") {
              recompute(rule, "random", density);
            } else {
              recompute(rule, "centered", density);
            }
          }}
        >
          New seed
        </button>
      </div>

      <details className="eca-demo__mapping">
        <summary>Neighborhood map (111 → … → 000)</summary>
        <ul className="eca-demo__map-list">
          {mapping.map(([n, out]) => (
            <li key={n}>
              <code>{n.toString(2).padStart(3, "0")}</code>
              <span aria-hidden="true">→</span>
              <strong>{out}</strong>
            </li>
          ))}
        </ul>
      </details>

      <div className="eca-demo__canvas-wrap">
        <canvas ref={canvasRef} className="eca-demo__canvas" aria-label="Space-time diagram" />
      </div>
    </div>
  );
}
