import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDemo } from '../src/demo/model.ts';

test('rectangle dimensions produce a coherent schematic and two-sided area', () => {
  const result = calculateDemo({ width: 6, length: 8, height: 1.2 });
  assert.equal(result.perimeter, 28);
  assert.equal(result.area, 67.2);
  assert.equal(result.segments.length, 24);
  assert.equal(result.panelCount, 96);
  assert.ok(
    result.segments.every((s) => s.length > 0 && s.length <= 1.2 + 1e-9),
  );
});
test('larger dimensions and height increase material illustration', () => {
  const base = calculateDemo({ width: 4, length: 4, height: 0.6 });
  const larger = calculateDemo({ width: 8, length: 8, height: 1.8 });
  assert.ok(larger.panelCount > base.panelCount);
  assert.ok(larger.area > base.area);
});
test('invalid and out-of-range values cannot break the canvas', () => {
  const result = calculateDemo({ width: NaN, length: Infinity, height: -5 });
  assert.ok(Number.isFinite(result.area));
  assert.ok(result.width >= 2 && result.width <= 12);
  assert.ok(result.length >= 2 && result.length <= 16);
  assert.ok(result.height >= 0.6 && result.height <= 2.4);
});
test('segments cover every edge without extending beyond the rectangle', () => {
  const result = calculateDemo({ width: 5.5, length: 7.5, height: 1.8 });
  const length = result.segments.reduce((sum, s) => sum + s.length, 0);
  assert.ok(Math.abs(length - result.perimeter) < 1e-8);
  for (const s of result.segments) {
    for (const [x, y] of [s.start, s.end]) {
      assert.ok(x >= 0 && x <= result.width);
      assert.ok(y >= 0 && y <= result.length);
    }
  }
});
