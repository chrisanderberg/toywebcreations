import { useEffect, useMemo, useRef, useState } from "react";
import "./Demo.css";
import {
  createCenteredSeed,
  createRandomSeed,
  generatePattern,
  ruleToMapping
} from "./automata";

type SeedMode = "centered" | "random";

const PRESET_RULES = [30, 90, 110, 184];
const DEFAULT_RULE = 30;
const MIN_COLUMNS = 59;
const MAX_COLUMNS = 141;
const MIN_ROWS = 80;
const MAX_ROWS = 220;
const TARGET_CELL_SIZE = 7;

function clampRule(rule: number): number {
  if (Number.isNaN(rule)) {
    return DEFAULT_RULE;
  }

  return Math.min(255, Math.max(0, Math.round(rule)));
}

function formatNeighborhood(bits: number): string {
  return bits.toString(2).padStart(3, "0");
}

function toggleNeighborhood(rule: number, neighborhood: number): number {
  return rule ^ (1 << neighborhood);
}

function makeSeed(width: number, mode: SeedMode, density: number): number[] {
  return mode === "centered"
    ? createCenteredSeed(width)
    : createRandomSeed(width, density);
}

export default function ElementaryCellularAutomataDemo() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rule, setRule] = useState(DEFAULT_RULE);
  const [seedMode, setSeedMode] = useState<SeedMode>("centered");
  const [seedVersion, setSeedVersion] = useState(0);
  const [dpr, setDpr] = useState(1);
  const [density, setDensity] = useState(0.36);
  const [columns, setColumns] = useState(101);
  const [rows, setRows] = useState(144);
  const [initialRow, setInitialRow] = useState<number[]>(() => createCenteredSeed(101));

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? element.clientWidth;
      const height = entries[0]?.contentRect.height ?? element.clientHeight;
      const nextColumns = Math.min(
        MAX_COLUMNS,
        Math.max(MIN_COLUMNS, Math.floor(width / TARGET_CELL_SIZE))
      );
      const nextRows = Math.min(
        MAX_ROWS,
        Math.max(MIN_ROWS, Math.floor(height / TARGET_CELL_SIZE))
      );

      setColumns((current) => (current === nextColumns ? current : nextColumns));
      setRows((current) => (current === nextRows ? current : nextRows));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setInitialRow(makeSeed(columns, seedMode, density));
  }, [columns, seedMode, density, seedVersion]);

  useEffect(() => {
    const updateDpr = () => {
      setDpr(window.devicePixelRatio || 1);
    };

    updateDpr();

    const mediaQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
    mediaQuery.addEventListener("change", updateDpr);
    window.addEventListener("resize", updateDpr);

    return () => {
      mediaQuery.removeEventListener("change", updateDpr);
      window.removeEventListener("resize", updateDpr);
    };
  }, [dpr]);

  const pattern = useMemo(
    () => generatePattern(initialRow, rule, rows),
    [initialRow, rule, rows]
  );
  const mapping = useMemo(() => ruleToMapping(rule), [rule]);
  const liveCells = useMemo(
    () => pattern.reduce((total, row) => total + row.reduce((rowTotal, cell) => rowTotal + cell, 0), 0),
    [pattern]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pattern.length === 0) {
      return;
    }

    const width = pattern[0].length;
    const height = pattern.length;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = false;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#04110a";
    context.fillRect(0, 0, width, height);

    pattern.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (!cell) {
          return;
        }

        context.fillStyle = rowIndex === 0 ? "#d9ffe9" : "#8fffc5";
        context.fillRect(columnIndex, rowIndex, 1, 1);
      });
    });
  }, [pattern, dpr]);

  function regenerateSeed() {
    setSeedVersion((current) => current + 1);
  }

  function randomizeSeed() {
    setSeedMode("random");
    setSeedVersion((current) => current + 1);
  }

  return (
    <div className="eca-demo">
      <div className="eca-demo__headline">
        <div>
          <p className="eca-demo__eyebrow">Elementary rule system</p>
          <h2>One row becomes the next, and simple bit patterns turn into stripes, ladders, and turbulence.</h2>
          <p className="eca-demo__lede">
            Each cell only checks its left neighbor, itself, and its right neighbor. The current rule decides which three-cell neighborhoods create a live cell in the next row.
          </p>
        </div>

        <div className="eca-demo__stats" aria-live="polite">
          <span>Rule {rule}</span>
          <strong>{columns} columns × {rows} rows</strong>
          <span>{liveCells.toLocaleString()} illuminated cells in the current frame</span>
        </div>
      </div>

      <div className="eca-demo__controls">
        <label className="eca-demo__control eca-demo__control--rule" htmlFor="eca-rule-range">
          <span>Rule</span>
          <div className="eca-demo__rule-inputs">
            <input
              id="eca-rule-range"
              type="range"
              min="0"
              max="255"
              value={rule}
              onChange={(event) => setRule(clampRule(Number(event.target.value)))}
            />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="255"
              value={rule}
              onChange={(event) => setRule(clampRule(Number(event.target.value)))}
              aria-label="Elementary cellular automata rule number"
            />
          </div>
        </label>

        <fieldset className="eca-demo__control eca-demo__mode-picker">
          <legend>Seed</legend>
          <label>
            <input
              type="radio"
              name="eca-seed-mode"
              checked={seedMode === "centered"}
              onChange={() => setSeedMode("centered")}
            />
            Centered cell
          </label>
          <label>
            <input
              type="radio"
              name="eca-seed-mode"
              checked={seedMode === "random"}
              onChange={() => setSeedMode("random")}
            />
            Random row
          </label>
        </fieldset>

        <label className="eca-demo__control" htmlFor="eca-density-range">
          <span>Random density</span>
          <div className="eca-demo__density">
            <input
              id="eca-density-range"
              type="range"
              min="0.08"
              max="0.92"
              step="0.02"
              value={density}
              onChange={(event) => setDensity(Number(event.target.value))}
              disabled={seedMode !== "random"}
            />
            <strong>{Math.round(density * 100)}%</strong>
          </div>
        </label>

        <div className="eca-demo__actions">
          <button type="button" onClick={regenerateSeed}>
            Regenerate
          </button>
          <button type="button" onClick={randomizeSeed} data-emphasis="true">
            Randomize
          </button>
        </div>
      </div>

      <div className="eca-demo__presets" role="group" aria-label="Preset elementary rules">
        {PRESET_RULES.map((preset) => (
          <button key={preset} type="button" onClick={() => setRule(preset)} data-active={rule === preset}>
            Rule {preset}
          </button>
        ))}
      </div>

      <div className="eca-demo__display">
        <div className="eca-demo__mapping">
          <div className="eca-demo__mapping-header">
            <p className="eca-demo__eyebrow">Neighborhood mapping</p>
            <span>Binary triplets read left-to-right, top-to-bottom.</span>
          </div>
          <div className="eca-demo__mapping-grid" role="group" aria-label={`Rule ${rule} neighborhood outcomes`}>
            {mapping.map(([neighborhood, output]) => (
              <button
                key={neighborhood}
                type="button"
                className="eca-demo__mapping-cell"
                data-active={output === 1}
                onClick={() => setRule((current) => toggleNeighborhood(current, neighborhood))}
                aria-pressed={output === 1}
                aria-label={`Toggle neighborhood ${formatNeighborhood(neighborhood)} to ${output === 1 ? "off" : "on"}`}
              >
                <strong>{formatNeighborhood(neighborhood)}</strong>
                <span>{output}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="eca-demo__viewport-frame">
          <div className="eca-demo__viewport" ref={viewportRef}>
            <canvas
              ref={canvasRef}
              className="eca-demo__canvas"
              aria-label={`Elementary cellular automata visualization for rule ${rule}`}
            />
          </div>
          <p className="eca-demo__caption">
            Top row is the seed. Every row below it is generated from the row immediately above using fixed-zero edges.
          </p>
        </div>
      </div>
    </div>
  );
}
