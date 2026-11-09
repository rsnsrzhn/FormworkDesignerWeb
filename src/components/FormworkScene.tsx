type Point = [number, number, number];
const project = ([x, y, z]: Point) =>
  `${410 + (x - y) * 22},${135 + (x + y) * 10 - z * 48}`;
const poly = (points: Point[]) => points.map(project).join(' ');
function Block({
  x,
  y,
  w,
  d,
  h,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  accent?: boolean;
}) {
  const a: Point = [x, y, 0],
    b: Point = [x + w, y, 0],
    c: Point = [x + w, y + d, 0],
    e: Point = [x, y + d, 0];
  const top = (p: Point): Point => [p[0], p[1], h];
  return (
    <g stroke="#193d66" strokeWidth="1.1" strokeLinejoin="round">
      <polygon
        points={poly([e, c, top(c), top(e)])}
        fill={accent ? '#94bce3' : '#cbdff0'}
      />
      <polygon
        points={poly([b, c, top(c), top(b)])}
        fill={accent ? '#5486b5' : '#80a9d0'}
      />
      <polygon points={poly([top(a), top(b), top(c), top(e)])} fill="#f0f7fe" />
      <path
        d={`M${project(top(e))}L${project(top(c))}M${project([e[0], e[1], h / 2])}L${project([c[0], c[1], h / 2])}`}
        fill="none"
        opacity=".5"
      />
    </g>
  );
}
export function FormworkScene() {
  return (
    <svg
      viewBox="0 0 800 480"
      className="formwork-scene"
      role="img"
      aria-label="Иллюстрация объёмной раскладки щитовой опалубки здания"
    >
      <defs>
        <pattern
          id="scene-grid"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="matrix(1 .45 -1 .45 400 20)"
        >
          <path d="M40 0H0V20" fill="none" stroke="#c6d9ed" strokeWidth=".6" />
        </pattern>
        <filter id="scene-shadow">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect width="800" height="480" fill="url(#scene-grid)" />
      <ellipse
        cx="400"
        cy="326"
        rx="210"
        ry="63"
        fill="#6d9cc2"
        opacity=".13"
        filter="url(#scene-shadow)"
      />
      <polygon
        points={poly([
          [-0.6, -0.6, 0],
          [11.6, -0.6, 0],
          [11.6, 9.6, 0],
          [-0.6, 9.6, 0],
        ])}
        fill="#e2edf7"
        stroke="#a8c3df"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <Block key={`back${i}`} x={i * 1.2} y={0} w={1.18} d={0.2} h={1.8} />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <Block
          key={`right${i}`}
          x={10.6}
          y={0.2 + i * 1.2}
          w={0.2}
          d={1.18}
          h={1.8}
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Block
          key={`inner${i}`}
          x={5.4}
          y={0.2 + i * 1.2}
          w={0.2}
          d={1.18}
          h={1.8}
          accent
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Block
          key={`cross${i}`}
          x={5.6 + i * 1.2}
          y={4.7}
          w={1.18}
          d={0.2}
          h={1.8}
          accent
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <Block
          key={`left${i}`}
          x={0}
          y={0.2 + i * 1.2}
          w={0.2}
          d={1.18}
          h={1.2}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Block
          key={`front${i}`}
          x={i * 1.2}
          y={8.6}
          w={1.18}
          d={0.2}
          h={i > 3 && i < 6 ? 0.6 : 1.2}
        />
      ))}
      <g fill="none" stroke="#6486a9" strokeWidth="1">
        <path d={`M${project([0, 10, 0])}L${project([10.8, 10, 0])}`} />
        <path d={`M${project([-1, 0, 0])}L${project([-1, 8.8, 0])}`} />
      </g>
      <g fill="#52718e" fontSize="12" fontFamily="inherit">
        <text x="337" y="386" transform="rotate(24 337 386)">
          10 800 мм
        </text>
        <text x="238" y="177" transform="rotate(-24 238 177)">
          8 800 мм
        </text>
      </g>
      <g>
        <circle
          cx="563"
          cy="192"
          r="5"
          fill="#2364d2"
          stroke="#fff"
          strokeWidth="3"
        />
        <path d="M568 190l44-35h70" fill="none" stroke="#8aa8c6" />
        <text x="617" y="146" fill="#4e6d8c" fontSize="12">
          Щитовая опалубка
        </text>
      </g>
    </svg>
  );
}
