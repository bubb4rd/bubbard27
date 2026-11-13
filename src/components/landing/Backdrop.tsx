"use client";

import { useEffect, useRef } from "react";

/**
 * The landing page's WebGL backdrop and its one light.
 *
 * The dot field breathes and swells near the cursor. When a featured project
 * opens (hover on fine pointers, keyboard focus everywhere) the field around
 * its icon turns into that project's world, in its brand colour: WKCC Perks
 * sends rings of pings out to members, Elovate draws a climbing rank line,
 * Vaultair scrambles and locks, and the portrait gets a marching selection.
 * CSS stays the source of truth for which project is open; this reads it.
 *
 * The cursor is also the room's lamp: each frame writes --sx/--sy on the root
 * (shadow offsets away from the light) and --lx/--ly/--lit on each featured
 * icon (where its highlight sits and how strong it is).
 *
 * Renders at half resolution, at most 30 frames a second, pauses while the
 * tab is hidden; under reduced motion time stands still and the field only
 * redraws when a project opens or closes. Without WebGL the canvas stays
 * transparent over the plain wall colour.
 */

/** The field each featured project opens, in shader order. */
export const fields = ["ripple", "climb", "scramble", "marquee"] as const;
export type FieldName = (typeof fields)[number];

const vertex = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 res;
uniform float time;
uniform vec2 mouse;    // 0..1, eased
uniform vec4 open;     // eased weight of each field
uniform vec4 since;    // seconds since each field opened
uniform vec2 focus[4]; // icon centre of each field, canvas px

const vec3 wall = vec3(0.949, 0.949, 0.937);
const vec3 ink = vec3(0.78, 0.78, 0.76);
const vec3 green = vec3(0.478, 0.757, 0.263); // WKCC #7AC143
const vec3 gold = vec3(0.918, 0.702, 0.031);  // Elovate #EAB308
const vec3 blue = vec3(0.145, 0.388, 0.922);  // Vaultair #2563EB
const vec3 red = vec3(0.851, 0.227, 0.149);   // vermilion #D93A26
const float cell = 9.0; // 18px grid at half resolution
const float presence = 0.55; // 0 hides the project fields, 1 is full strength

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// p: offset from the icon in heights of the canvas; cs: one cell in the same unit.
// Each field stays near its project and moves slowly: it sits behind the
// mockups, never competes with them.

/** WKCC Perks: rings leave the icon and ping scattered members as they pass. */
float ripple(vec2 p, vec2 id, float t) {
  float d = length(p);
  float member = step(hash(id), 0.05);
  float k = 0.0;
  for (int i = 0; i < 3; i++) {
    float start = float(i) / 3.0;
    float ph = fract(t * 0.22 - start);
    float on = step(start, t * 0.22);
    float r = ph * 0.8;
    float fall = (1.0 - ph) * (1.0 - ph);
    k += on * fall * exp(-pow((d - r) * 18.0, 2.0));
    float passed = r - d;
    k += on * fall * member * step(0.0, passed) * exp(-passed * 6.0);
  }
  return min(k, 1.0);
}

/** Elovate: a rank line climbs left to right through the icon, its area filled below. */
float climb(vec2 p, float cs, float t) {
  float h = -0.26 + 0.52 * smoothstep(-1.3, 1.1, p.x)
          + 0.04 * sin(p.x * 8.0 + 1.3) + 0.018 * sin(p.x * 21.0)
          + 0.008 * sin(time * 1.4 + p.x * 5.0);
  h = floor(h / cs) * cs;
  float front = -1.9 + t * 3.2;
  float shown = step(p.x, front);
  float dy = p.y - h;
  float edge = step(abs(dy), cs * 0.5);
  float area = step(dy, 0.0) * 0.16 * smoothstep(-0.35, 0.0, dy);
  float head = exp(-pow((p.x - front) * 18.0, 2.0)) * edge;
  // Strongest around the project, gone well before the screen edges.
  float near = smoothstep(0.85, 0.25, abs(p.x));
  return shown * near * min(edge + area + head, 1.0);
}

/** Vaultair: cells flicker like ciphertext; a scan line locks them into a steady grid. */
float scramble(vec2 p, vec2 id, float cs, float t) {
  float region = smoothstep(0.36, 0.08, length(p * vec2(0.7, 1.0)));
  float tick = floor(time * 4.0 + hash(id * 1.7) * 4.0);
  float bit = step(0.72, hash(id + tick * 0.731));
  float scan = 0.4 - mod(t * 0.35, 1.0);
  float locked = step(scan, p.y);
  float line = step(abs(p.y - scan), cs * 0.5);
  return region * min(mix(bit * 0.8, 0.35, locked) + line * 0.7, 1.0);
}

/** The portrait: a vermilion selection with marching ants and corner handles. */
float marquee(vec2 p, vec2 id, float cs, float t) {
  vec2 c = vec2(0.0, 0.15);
  vec2 size = vec2(0.24, 0.22) * (0.85 + 0.15 * smoothstep(0.0, 0.45, t));
  vec2 q = abs(p - c) - size;
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  float border = step(abs(sd), cs * 0.5);
  float ants = step(0.4, fract((id.x + id.y) / 5.0 - time * 0.5));
  float handle = step(length(q), cs * 1.6);
  return max(border * (0.35 + 0.65 * ants), handle);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 id = floor(frag / cell);
  vec2 c = (id + 0.5) * cell;
  vec2 g = frag - c;
  vec2 uv = c / res;
  float aspect = res.x / res.y;
  float cs = cell / res.y;

  float wave = 0.5 + 0.5 * sin(uv.x * 5.0 - uv.y * 3.0 + time * 0.6);
  float near = smoothstep(0.28, 0.0, distance(uv * vec2(aspect, 1.0), mouse * vec2(aspect, 1.0)));
  float fade = smoothstep(0.0, 0.6, uv.y) * 0.9;
  float calm = 1.0 - 0.3 * max(max(open.x, open.y), max(open.z, open.w));

  float k0 = 0.0, k1 = 0.0, k2 = 0.0, k3 = 0.0;
  if (open.x > 0.001) k0 = open.x * ripple((c - focus[0]) / res.y, id, since.x);
  if (open.y > 0.001) k1 = open.y * climb((c - focus[1]) / res.y, cs, since.y);
  if (open.z > 0.001) k2 = open.z * scramble((c - focus[2]) / res.y, id, cs, since.z);
  if (open.w > 0.001) k3 = open.w * marquee((c - focus[3]) / res.y, id, cs, since.w);
  float k = k0 + k1 + k2 + k3;
  vec3 tint = (k0 * green + k1 * gold + k2 * blue + k3 * red) / max(k, 1e-4);
  // How loudly the fields speak: dots barely swell and only part-way take the tint.
  k = min(k, 1.0) * presence;

  float r = 0.55 + wave * 0.35 + near * 0.9 + k * 1.1;
  float d = smoothstep(r + 0.6, r - 0.2, length(g));
  vec3 col = mix(wall, ink, d * (0.35 + near * 0.4) * fade * calm);
  col = mix(col, tint, d * k * 0.75);
  float grain = (hash(frag + fract(time)) - 0.5) * 0.018;
  gl_FragColor = vec4(col + grain, 1.0);
}`;

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

export default function Backdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const gl = el?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!el || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("res");
    const uTime = u("time");
    const uMouse = u("mouse");
    const uOpen = u("open");
    const uSince = u("since");
    const uFocus = u("focus");

    let resized = true;
    const resize = () => {
      el.width = Math.max(1, Math.round(el.clientWidth / 2));
      el.height = Math.max(1, Math.round(el.clientHeight / 2));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
      resized = true;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);

    // The field drifts after the cursor; the lamp follows it closely.
    const target = { x: 0.7, y: 0.75 };
    const eased = { ...target };
    const lamp = { x: target.x * innerWidth, y: (1 - target.y) * innerHeight };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / innerWidth;
      target.y = 1 - e.clientY / innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const root = document.documentElement;
    const icons = [...document.querySelectorAll<HTMLElement>(".feature-icon .app-icon")];
    const written = new Map<HTMLElement, Record<string, number>>();
    /** Writes custom properties only when they move, so a still cursor costs no style work. */
    const put = (node: HTMLElement, props: Record<string, number>, unit: string) => {
      const last = written.get(node) ?? {};
      for (const key in props) {
        if (last[key] !== undefined && Math.abs(last[key] - props[key]) < 0.05) continue;
        last[key] = props[key];
        node.style.setProperty(key, `${props[key].toFixed(2)}${unit}`);
      }
      written.set(node, last);
    };

    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weights = [0, 0, 0, 0];
    const opened = [0, 0, 0, 0];
    const focus = new Float32Array(8);
    const start = performance.now();
    let lastMode = -2;
    let frame = 0;
    let last = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < 33 || document.hidden) return;
      // Eases by elapsed time, not frames, so a dropped frame never slows the field.
      const dt = Math.min((now - last) / 1000, 0.25);
      const toward = (rate: number) => (still ? 1 : 1 - Math.exp(-dt * rate));
      last = now;
      const t = (now - start) / 1000;

      // Which project is open, read from the same states the CSS opens on.
      const open =
        (hoverable.matches && document.querySelector<HTMLElement>(".feature[data-field]:hover")) ||
        document.querySelector<HTMLElement>(".feature[data-field]:focus-visible");
      const mode = open ? fields.indexOf(open.dataset.field as FieldName) : -1;
      let centre: { x: number; y: number } | null = null;
      if (open && mode >= 0) {
        const box = open.querySelector(".feature-icon")!.getBoundingClientRect();
        centre = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
        focus[mode * 2] = (centre.x / innerWidth) * el.width;
        focus[mode * 2 + 1] = (1 - centre.y / innerHeight) * el.height;
        if (weights[mode] < 0.02) opened[mode] = t;
      }
      const ease = toward(5);
      for (let i = 0; i < 4; i++) weights[i] += ((i === mode ? 1 : 0) - weights[i]) * ease;

      // One light: shadows fall away from the lamp, highlights sit toward it.
      const follow = toward(12);
      lamp.x += (target.x * innerWidth - lamp.x) * follow;
      lamp.y += ((1 - target.y) * innerHeight - lamp.y) * follow;
      const from = centre ?? { x: innerWidth / 2, y: innerHeight / 2 };
      const boxes = icons.map((icon) => icon.getBoundingClientRect());
      put(root, { "--sx": clamp((from.x - lamp.x) * 0.025, 14), "--sy": clamp((from.y - lamp.y) * 0.025, 14) }, "px");
      boxes.forEach((box, i) => {
        const dx = box.left + box.width / 2 - lamp.x;
        const dy = box.top + box.height / 2 - lamp.y;
        put(icons[i], { "--isx": clamp(dx * 0.03, 10), "--isy": clamp(dy * 0.03, 10) }, "px");
        put(icons[i], { "--lx": clamp(((lamp.x - box.left) / box.width) * 100, 160), "--ly": clamp(((lamp.y - box.top) / box.height) * 100, 160) }, "%");
        put(icons[i], { "--lit": 0.3 + 0.7 * Math.max(0, 1 - Math.hypot(dx, dy) / 700) }, "");
      });

      // Under reduced motion the field is a still frame that changes only with the open project.
      if (still && mode === lastMode && !resized) return;
      lastMode = mode;
      resized = false;
      const drift = toward(1.2);
      eased.x += (target.x - eased.x) * drift;
      eased.y += (target.y - eased.y) * drift;
      gl.uniform1f(uTime, still ? 12 : t);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.uniform4f(uOpen, weights[0], weights[1], weights[2], weights[3]);
      gl.uniform4fv(uSince, opened.map((o) => (still ? 10 : t - o)));
      gl.uniform2fv(uFocus, focus);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      el.dataset.ready = "";
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      for (const node of written.keys()) for (const key in written.get(node)) node.style.removeProperty(key);
      // Free what this effect made but keep the context: a canvas's context
      // can't be recreated once lost, and React may run this effect again.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-(--dur-slow) data-ready:opacity-100"
    />
  );
}
