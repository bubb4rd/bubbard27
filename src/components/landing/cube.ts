/**
 * The loader cube's tumble, and the shading that makes it read as solid while it turns. One cycle is three
 * half-turns about the cube's own axes (the logo's isometric view sits outside them, so each turns about an
 * edge direction of the cube as it rests): the B rolls up over the top and away (Z), the cube turns end over
 * end with the B out of sight (X), then swings round to bring the B back in on the right (Y). The three net to
 * nothing, so every cycle ends on the logo.
 *
 * Faces have no lighting in CSS, so each face carries an ink veil whose opacity is worked out here from how far
 * that face has turned from the viewer: clear while it faces you at least as squarely as at rest (so the
 * resting cube is the flat white logo), darkening as it turns edge-on. Both sets of keyframes are written out
 * as CSS, so the browser runs them like any other animation, transform and opacity only.
 */

const cycle = 1200;
/** Gathers, then whips round and clicks home: a cube turned by hand. */
const ease = [0.7, 0, 0.2, 1.1] as const;
/** The logo's isometric view: turned 45° about the vertical, then tipped so the near corner faces you. */
const iso = [
  ["X", -35.264],
  ["Y", -45],
] as const;
/** Each turn and the share of the cycle it takes; the rests between are the beats. */
const turns = [
  { axis: "Z", angle: -180, from: 0.06, to: 0.34 },
  { axis: "X", angle: 180, from: 0.38, to: 0.64 },
  { axis: "Y", angle: 180, from: 0.68, to: 0.94 },
] as const;
/** How dark a face gets, edge-on. */
const veil = 0.6;
/** Shading stops per turn; the opacity runs linearly between them. */
const steps = 10;

export const faces = {
  front: [0, 0, 1],
  back: [0, 0, -1],
  right: [1, 0, 0],
  left: [-1, 0, 0],
  top: [0, -1, 0],
  bottom: [0, 1, 0],
} as const;

type Axis = "X" | "Y" | "Z";
type Vec = readonly [number, number, number];

/** CSS's rotateX/Y/Z, applied to a vector (y points down). */
function rotate([x, y, z]: Vec, axis: Axis, deg: number): Vec {
  const c = Math.cos((deg * Math.PI) / 180);
  const s = Math.sin((deg * Math.PI) / 180);
  if (axis === "X") return [x, y * c - z * s, y * s + z * c];
  if (axis === "Y") return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
}

/** cubic-bezier(ease) at x, by bisection on the curve's parameter. */
function eased(x: number) {
  const [x1, y1, x2, y2] = ease;
  const bez = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(x1, x2, mid) < x) lo = mid;
    else hi = mid;
  }
  return bez(y1, y2, (lo + hi) / 2);
}

/** Each turn's angle at a point in the cycle (0 to 1). */
function angles(at: number) {
  return turns.map(({ angle, from, to }) => (at <= from ? 0 : at >= to ? angle : angle * eased((at - from) / (to - from))));
}

/** The transform at given turn angles: the isometric view, then the turns, latest outermost. */
function transform(turned: number[]) {
  const spins = turns.map(({ axis }, i) => `rotate${axis}(${turned[i]}deg)`).toReversed();
  return [...iso.map(([axis, deg]) => `rotate${axis}(${deg}deg)`), ...spins].join(" ");
}

/** How squarely a face (by its resting normal) faces the viewer at given turn angles: 1 head-on, 0 edge-on. */
function facing(normal: Vec, turned: number[]) {
  let v = normal;
  turns.forEach(({ axis }, i) => {
    v = rotate(v, axis, turned[i]);
  });
  for (const [axis, deg] of iso.toReversed()) v = rotate(v, axis, deg);
  return v[2];
}

const pct = (at: number) => `${+(at * 100).toFixed(2)}%`;
const rest = 1 / Math.sqrt(3);

const tumble = [0, ...turns.flatMap(({ from, to }) => [from, to]), 1]
  .map((at) => `${pct(at)}{transform:${transform(angles(at))}}`)
  .join("");

const shade = Object.entries(faces).map(([side, normal]) => {
  const at = [0, ...turns.flatMap(({ from, to }) => Array.from({ length: steps + 1 }, (_, i) => from + ((to - from) * i) / steps)), 1];
  const opacity = at.map((t) => +(veil * Math.min(1, Math.max(0, 1 - facing(normal, angles(t)) / rest))).toFixed(3));
  // Only the stops where the veil changes on one side or the other.
  const stops = at.flatMap((t, i) =>
    i === 0 || i === at.length - 1 || opacity[i] !== opacity[i - 1] || opacity[i] !== opacity[i + 1] ? [`${pct(t)}{opacity:${opacity[i]}}`] : [],
  );
  return `@keyframes loader-shade-${side}{${stops.join("")}}.loader-face[data-face="${side}"]::after{animation-name:loader-shade-${side}}`;
});

export const cubeCss =
  `@keyframes loader-tumble{${tumble}}` +
  shade.join("") +
  `.loader-spin{animation:loader-tumble ${cycle}ms cubic-bezier(${ease.join(",")}) infinite}` +
  `.loader-face::after{animation-duration:${cycle}ms;animation-timing-function:linear;animation-iteration-count:infinite}` +
  `@media (prefers-reduced-motion:reduce){.loader-spin,.loader-face::after{animation:none}}`;
