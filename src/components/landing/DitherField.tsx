"use client";

import { useEffect, useRef } from "react";

/**
 * A dithered pixel ribbon behind the top of the page.
 *
 * The ribbon cuts in from the top edge at an angle, runs down through the
 * open space beside the headline, dips to the floor and climbs back out past
 * the top right corner, swelling to about three times its width on that climb to
 * fill the space around the portrait. It passes behind any opaque element on
 * the way (the portrait sheet, covers). Each cell's value is ordered-dithered (4×4 Bayer)
 * into four steps: empty, a faint grid cell, the edge colour and the core
 * colour, from --dither-halo, --dither-edge and --dither-core (.dither-field).
 *
 * Render it as a sibling of the page content: it sits behind everything from
 * the top of its containing block, full width. Markers anywhere in its
 * parent: [data-dither-clear] boxes stay bare, with the field growing back
 * in around them; on wide screens the bottom of [data-dither-floor] is where
 * the field ends. Once the columns stack the field instead ends a little way
 * behind the top of [data-dither-floor-narrow] and runs its own spine.
 *
 * If the field is on screen at load the ribbon draws itself in along its
 * path; if it starts below the fold it is simply there, complete, by the
 * time it is scrolled to. Then it holds still. The
 * pointer is what moves it: the ribbon parts around the cursor, a stroke
 * drags it along and springs back, how fast you move sets how fast its edges
 * churn and its pulse runs, and a click sends a ripple through it. Frames
 * run only while something is settling, at most 30 a second, on screen and
 * with the tab visible; under reduced motion it is one still, complete frame
 * that ignores the pointer and redraws only on resize.
 */

const CELL = 8; // CSS px per cell, gap included.
const GAP = 1;
const FPS = 30;
/** How far, in CSS px, the field takes to grow back in from a cleared box. */
const CLEAR = 56;
/** Seconds the ribbon takes to draw in. */
const INTRO = 1.6;
/** Reach of the parting around the cursor, and how far it pushes, in px. */
const LENS = 90;
const LENS_PUSH = 52;
/** Reach of a stroke's drag, in px, and px of drag per px/s of pointer speed. */
const DRAG_REACH = 90;
const DRAG = 0.012;
/** Pointer speed, in px/s, that churns the field at full rate. */
const BRISK = 1400;
/** Click ripples: speed in px/s, lifetime in s, ring thickness and push in px. */
const RIPPLE_SPEED = 720;
const RIPPLE_LIFE = 1.1;
const RIPPLE_BAND = 28;
const RIPPLE_PUSH = 26;

/** The ribbon's spine on wide screens, as fractions of the field's width and height. Starts and ends off the field. */
const SPINE_WIDE: [number, number][] = [
  [0.27, -0.2],
  [0.42, 0.28],
  [0.5, 0.82],
  [0.6, 0.94],
  [0.7, 0.62],
  [0.86, 0.22],
  [1.08, -0.12],
];
/** Once the columns stack: in from the top right, across the gap above the headline, down behind it at the left, out across the gap below it and behind the portrait's top. */
const SPINE_NARROW: [number, number][] = [
  [1.15, -0.12],
  [0.75, 0.24],
  [0.35, 0.3],
  [0.05, 0.5],
  [0.3, 0.82],
  [0.75, 0.9],
  [1.15, 1.1],
];
/** How far, in px, the stacked field reaches down behind the top of its floor. */
const OVERLAP = 48;
/** How much wider, as a multiple of its width, the wide ribbon grows on its climb out past the portrait. */
const SWELL = 2;
const SAMPLES = 180;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const hash = (x: number, y: number) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const unit = (t: number) => Math.max(0, Math.min(1, t));

/** Smooth value noise in [0, 1]. */
const noise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x: number, y: number) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;

/** Catmull-Rom through a spine's points, in px, as SAMPLES points evenly spaced in parameter. */
const spine = (w: number, h: number, points: [number, number][]) => {
  const pts = points.map(([x, y]) => [x * w, y * h]);
  const out = new Float32Array(SAMPLES * 2);
  const spans = pts.length - 1;
  for (let i = 0; i < SAMPLES; i++) {
    const f = (i / (SAMPLES - 1)) * spans;
    const k = Math.min(spans - 1, Math.floor(f));
    const t = f - k;
    const p0 = pts[Math.max(0, k - 1)];
    const p1 = pts[k];
    const p2 = pts[k + 1];
    const p3 = pts[Math.min(spans, k + 2)];
    for (let a = 0; a < 2; a++) {
      out[i * 2 + a] =
        0.5 *
        (2 * p1[a] +
          (p2[a] - p0[a]) * t +
          (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t +
          (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t * t * t);
    }
  }
  return out;
};

export default function DitherField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    const ctx = el?.getContext("2d");
    if (!el || !host || !ctx) return;

    const css = getComputedStyle(el);
    const colours = ["--dither-halo", "--dither-edge", "--dither-core"].map((name) => css.getPropertyValue(name).trim());
    const cleared = [...host.querySelectorAll<HTMLElement>("[data-dither-clear]")];
    const floor = host.querySelector<HTMLElement>("[data-dither-floor]");
    const floorNarrow = host.querySelector<HTMLElement>("[data-dither-floor-narrow]");
    // Tailwind's lg: the columns sit side by side.
    const wide = window.matchMedia("(min-width: 64rem)");

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    /** Half the ribbon's width, in px, where it is narrowest. */
    let half = 0;
    /** How far the field takes to grow back in from a cleared box, in px. */
    let clear = CLEAR;
    // Per cell, fixed until the next resize: distance to the spine, position along it, the ribbon's half-width there, room from cleared boxes.
    let dist = new Float32Array(0);
    let along = new Float32Array(0);
    let thick = new Float32Array(0);
    let room = new Float32Array(0);
    let levels = new Uint8Array(0);

    const measure = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const stacked = !wide.matches && floorNarrow;
      const outer = el.getBoundingClientRect();
      const w = el.clientWidth;
      const end = stacked ? floorNarrow.getBoundingClientRect().top + OVERLAP : (floor ?? host).getBoundingClientRect().bottom;
      const h = Math.max(0, Math.round(end - outer.top));
      el.style.height = `${h}px`;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL);
      rows = Math.floor(h / CELL);
      half = stacked ? 44 : Math.max(44, Math.min(96, w * 0.055));
      clear = stacked ? CLEAR / 2 : CLEAR;

      const n = cols * rows;
      dist = new Float32Array(n);
      along = new Float32Array(n);
      thick = new Float32Array(n);
      room = new Float32Array(n);
      levels = new Uint8Array(n);
      const path = spine(w, h, stacked ? SPINE_NARROW : SPINE_WIDE);
      const boxes = cleared.map((node) => {
        const r = node.getBoundingClientRect();
        return { left: r.left - outer.left, top: r.top - outer.top, right: r.right - outer.left, bottom: r.bottom - outer.top };
      });

      for (let y = 0; y < rows; y++) {
        const py = y * CELL + CELL / 2;
        for (let x = 0; x < cols; x++) {
          const px = x * CELL + CELL / 2;
          const i = y * cols + x;
          let best = Infinity;
          let at = 0;
          for (let s = 0; s < SAMPLES; s++) {
            const d = (path[s * 2] - px) ** 2 + (path[s * 2 + 1] - py) ** 2;
            if (d < best) {
              best = d;
              at = s;
            }
          }
          dist[i] = Math.sqrt(best);
          along[i] = at / (SAMPLES - 1);
          // Swells from the bottom of the dip, full once it has climbed behind the portrait.
          thick[i] = stacked ? half : half * (1 + SWELL * smooth(unit((along[i] - 0.4) / 0.25)));
          let near = Infinity;
          for (const b of boxes) {
            const dx = Math.max(b.left - px, 0, px - b.right);
            const dy = Math.max(b.top - py, 0, py - b.bottom);
            near = Math.min(near, Math.hypot(dx, dy));
          }
          room[i] = smooth(unit(near / clear));
        }
      }
    };

    /** Recent pointer samples: where, how fast (px/s) and how much of their drag is left. */
    const trail: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const ripples: { x: number; y: number; age: number }[] = [];
    const pointer = { x: 0, y: 0, inside: false };
    let prev: { x: number; y: number; t: number } | null = null;
    /** How strongly the cursor parts the field: eases in when it arrives, out when it leaves. */
    let lens = 0;
    /** How fast the field churns, from recent pointer speed; decays to 0, where it stands still. */
    let energy = 0;
    /** Seconds of churn so far: noise drift and the pulse advance only with energy. */
    let flow = 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let intro = still ? INTRO : 0;

    const draw = () => {
      // Draws in along the spine, from where it cuts in at the top.
      const reveal = smooth(unit(intro / INTRO)) * 1.2;
      const cap = half * 2;
      const warped = lens > 0.01 || trail.length > 0 || ripples.length > 0;
      const slack = warped ? cap : 0;
      for (let y = 0; y < rows; y++) {
        const py = y * CELL + CELL / 2;
        // Thins out over the last stretch above the floor, so it never ends on a hard row.
        const fade = smooth(unit((rows - y) / (rows * 0.16)));
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (dist[i] > thick[i] * 3 + slack || room[i] === 0) {
            levels[i] = 0;
            continue;
          }
          const px = x * CELL + CELL / 2;
          // Where this cell samples the ribbon from: shifted by the parting, the drag and any ripple.
          let ox = 0;
          let oy = 0;
          let ring = 0;
          if (warped) {
            const cx = px - pointer.x;
            const cy = py - pointer.y;
            const cd = Math.hypot(cx, cy) + 1e-3;
            const part = lens * LENS_PUSH * Math.exp(-(cd * cd) / (2 * LENS * LENS));
            ox += (cx / cd) * part;
            oy += (cy / cd) * part;
            for (const m of trail) {
              const dx = px - m.x;
              const dy = py - m.y;
              const f = m.life * DRAG * Math.exp(-(dx * dx + dy * dy) / (2 * DRAG_REACH * DRAG_REACH));
              ox += m.vx * f;
              oy += m.vy * f;
            }
            for (const r of ripples) {
              const dx = px - r.x;
              const dy = py - r.y;
              const d = Math.hypot(dx, dy) + 1e-3;
              const f = (1 - r.age / RIPPLE_LIFE) * Math.exp(-(((d - r.age * RIPPLE_SPEED) / RIPPLE_BAND) ** 2));
              ox += (dx / d) * RIPPLE_PUSH * f;
              oy += (dy / d) * RIPPLE_PUSH * f;
              ring += f;
            }
            const shift = Math.hypot(ox, oy);
            if (shift > cap) {
              ox *= cap / shift;
              oy *= cap / shift;
            }
          }
          const sx = Math.round((px - ox - CELL / 2) / CELL);
          const sy = Math.round((py - oy - CELL / 2) / CELL);
          if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) {
            levels[i] = 0;
            continue;
          }
          const j = sy * cols + sx;
          const n = fbm(sx * 0.09 + flow * 0.07, sy * 0.09 - flow * 0.05);
          // Ragged edges from the noise, a brighter pulse down the ribbon, and a flare where a ripple passes.
          const width = thick[j];
          const core = 1 - (dist[j] + (n - 0.5) * width * 1.4) / width;
          const pulse = 0.22 * Math.sin(along[j] * 16 - flow * 1.3);
          const gate = room[i] * fade * unit((reveal - along[j]) * 8);
          const v = (core + (pulse + ring * 0.5) * unit(core + 0.4) + (n - 0.5) * 0.3) * gate;
          const q = Math.max(0, Math.min(v * 3.2, 3));
          const step = Math.floor(q);
          let level = Math.min(3, step + (q - step > BAYER[(y & 3) * 4 + (x & 3)] ? 1 : 0));
          // Stray edge cells just outside the ribbon; they reshuffle only as the field churns.
          if (level < 2 && gate > 0.5 && hash(sx * 7 + 1, sy * 13 + Math.floor(flow * 1.5)) < unit(2.1 - dist[j] / width) * 0.035) level = 2;
          levels[i] = level;
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, el.width, el.height);
      const size = CELL - GAP;
      for (let level = 1; level <= 3; level++) {
        ctx.fillStyle = colours[level - 1];
        for (let i = 0; i < levels.length; i++) {
          if (levels[i] !== level) continue;
          ctx.fillRect((i % cols) * CELL, Math.floor(i / cols) * CELL, size, size);
        }
      }
    };

    let frame = 0;
    let last = 0;
    let visible = false;

    const settling = () =>
      intro < INTRO || energy > 0.01 || trail.length > 0 || ripples.length > 0 || Math.abs(lens - (pointer.inside ? 1 : 0)) > 0.01;

    const tick = (stamp: number) => {
      frame = requestAnimationFrame(tick);
      if (stamp - last < 1000 / FPS) return;
      // Eases by elapsed time, not frames, so a dropped frame never slows the field.
      const dt = Math.min((stamp - last) / 1000, 0.1);
      last = stamp;
      intro = Math.min(INTRO, intro + dt);
      flow += dt * energy * 2;
      energy *= Math.exp(-dt * 2.5);
      lens += ((pointer.inside ? 1 : 0) - lens) * (1 - Math.exp(-dt * 6));
      for (const m of trail) m.life *= Math.exp(-dt * 2.2);
      while (trail.length && trail[0].life < 0.02) trail.shift();
      for (const r of ripples) r.age += dt;
      while (ripples.length && ripples[0].age > RIPPLE_LIFE) ripples.shift();
      draw();
      if (!settling() || !visible || document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    /** Starts frames if something needs to move; they stop themselves once it has settled. */
    const kick = () => {
      if (frame || !visible || still || !settling()) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    /** Pointer position in the canvas, and whether it is over the field (a ribbon's width of slack around it). */
    const locate = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return { x, y, inside: x > -half && x < r.width + half && y > -half && y < r.height + half };
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const at = locate(e);
      if (at.inside && prev) {
        const dt = Math.max((e.timeStamp - prev.t) / 1000, 1 / 240);
        const vx = (at.x - prev.x) / dt;
        const vy = (at.y - prev.y) / dt;
        energy = Math.max(energy, Math.min(1.5, Math.hypot(vx, vy) / BRISK));
        trail.push({ x: at.x, y: at.y, vx, vy, life: 1 });
        if (trail.length > 24) trail.shift();
      }
      prev = { x: at.x, y: at.y, t: e.timeStamp };
      Object.assign(pointer, at);
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (!visible) return;
      const at = locate(e);
      if (!at.inside) return;
      ripples.push({ x: at.x, y: at.y, age: 0 });
      energy = Math.min(1.5, energy + 0.6);
      kick();
    };
    const onLeave = () => {
      pointer.inside = false;
      prev = null;
      kick();
    };
    // A finger lifting is the pointer leaving: no cursor stays behind to hold the parting open.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      // A tab hidden mid draw-in stops its frames; pick it back up on return.
      document.addEventListener("visibilitychange", kick);
    }

    const resize = () => {
      measure();
      draw();
    };
    resize();
    const sizes = new ResizeObserver(resize);
    sizes.observe(host);
    for (const node of cleared) sizes.observe(node);
    if (floorNarrow) sizes.observe(floorNarrow);
    const sight = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Out of sight at load: skip the draw-in, so the field is already whole when it's scrolled to (or captured).
      if (!visible && intro === 0) {
        intro = INTRO;
        draw();
      }
      kick();
    });
    sight.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      sight.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="dither-field pointer-events-none absolute inset-x-0 top-0 -z-10 w-full" />;
}
