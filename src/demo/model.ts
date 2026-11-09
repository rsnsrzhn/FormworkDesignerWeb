export type DemoInput = { width: number; length: number; height: number };
export type Segment = {
  start: [number, number];
  end: [number, number];
  length: number;
};
function bounded(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.max(min, Math.min(max, value))
    : fallback;
}
/** Schematic tutorial only: generic 1.2 × 0.6 m panels, two faces, no production fitting rules. */
export function calculateDemo(input: DemoInput) {
  const width = bounded(input.width, 2, 12, 6);
  const length = bounded(input.length, 2, 16, 8);
  const height = Math.round(bounded(input.height, 0.6, 2.4, 1.2) / 0.6) * 0.6;
  const corners: [number, number][] = [
    [0, 0],
    [width, 0],
    [width, length],
    [0, length],
  ];
  const segments: Segment[] = [];
  corners.forEach((start, index) => {
    const end = corners[(index + 1) % 4];
    const distance = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const count = Math.ceil(distance / 1.2);
    for (let part = 0; part < count; part++) {
      const a = (part * 1.2) / distance;
      const b = Math.min(((part + 1) * 1.2) / distance, 1);
      segments.push({
        start: [
          start[0] + (end[0] - start[0]) * a,
          start[1] + (end[1] - start[1]) * a,
        ],
        end: [
          start[0] + (end[0] - start[0]) * b,
          start[1] + (end[1] - start[1]) * b,
        ],
        length: (b - a) * distance,
      });
    }
  });
  const perimeter = 2 * (width + length);
  return {
    width,
    length,
    height,
    perimeter,
    area: Math.round(perimeter * height * 2 * 100) / 100,
    segments,
    panelCount: segments.length * 2 * Math.round(height / 0.6),
  };
}
