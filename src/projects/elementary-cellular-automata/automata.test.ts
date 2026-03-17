import test from "node:test";
import assert from "node:assert/strict";
import { evolveRow, ruleToMapping } from "./automata.ts";

test("ruleToMapping falls back to rule 0 when given NaN", () => {
  assert.deepEqual(ruleToMapping(Number.NaN), [
    [7, 0],
    [6, 0],
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
    [0, 0]
  ]);
});

test("evolveRow falls back to rule 0 when given NaN", () => {
  assert.deepEqual(evolveRow([0, 1, 1, 0, 1], Number.NaN), [0, 0, 0, 0, 0]);
});
