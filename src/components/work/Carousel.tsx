"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** Auto-roll speed in px per second: slow enough to read as it passes. */
const ROLL_SPEED = 26;
/** How long a row waits after the reader's last pan before rolling again, in ms. */
const RESUME_AFTER = 2500;

type Props = {
  children: ReactNode;
  /** The same pieces again for a looping row, rendered without view-transition names or priority. */
  repeat?: ReactNode;
  fade?: "both" | "lead";
  /** Hold the roll, e.g. on a stage layer that's offstage. */
  held?: boolean;
  /** A lone piece that runs off the bottom edge (see ShowcaseItem): no top or bottom fade, and it pins to the top once it's taller than the row. */
  bleed?: boolean;
};

/**
 * A row of media the reader pans sideways (trackpad, tilting wheel,
 * shift+wheel), with soft top and bottom edges.
 *
 * A row that fits sits centred with no edge fade. A row wider than the view
 * repeats once and rolls slowly on a loop, as on gianlucreates: it stops while
 * the reader pans it, picks up again a moment later, and never runs off
 * screen. Under reduced motion it holds still and starts at its first piece
 * instead. With fade "both" an eased fade shows on whichever side has more to
 * pan to; with "lead" the left edge always fades and the right edge is a hard
 * cut. A single piece has nothing to pan to, so it gets half the insets and
 * shrinks to fit between them.
 */
export default function Carousel({ children, repeat, fade = "both", held = false, bleed = false }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const set = useRef<HTMLDivElement>(null);
  const single = Children.count(children) === 1;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const [overflows, setOverflows] = useState(false);
  const loops = overflows && !single && !reduced && repeat != null;

  useEffect(() => {
    const el = scroller.current;
    const first = set.current;
    if (!el || !first) return;
    // Edges are written straight to data attributes, so scrolling never re-renders.
    const edges = () => {
      el.toggleAttribute("data-at-start", !loops && fade === "both" && el.scrollLeft <= 1);
      el.toggleAttribute("data-at-end", fade === "lead" || (!loops && el.scrollLeft + el.clientWidth >= el.scrollWidth - 1));
    };
    // Measured on the first pass alone, so the repeat never counts toward overflow.
    const measure = () => {
      const inset = parseFloat(getComputedStyle(el).paddingLeft);
      setOverflows(first.offsetWidth + 2 * inset > el.clientWidth + 1);
      edges();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(first);
    el.addEventListener("scroll", edges, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", edges);
    };
  }, [fade, loops]);

  useEffect(() => {
    const el = scroller.current;
    const first = set.current;
    if (!loops || held || !el || !first) return;
    let frame = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let resumeAt = 0;
    // One loop: the first pass plus the gap before its repeat.
    const period = () => first.offsetWidth + parseFloat(getComputedStyle(first.parentElement!).columnGap);

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      const panning = now < resumeAt;
      if (panning) pos = el.scrollLeft;
      else pos += (ROLL_SPEED * dt) / 1000;
      // The repeat sits exactly one period on, so shifting by a period never shows.
      const p = period();
      if (pos >= p) pos -= p;
      else if (panning && pos < 1) pos += p;
      if (Math.abs(el.scrollLeft - pos) >= 0.5) el.scrollLeft = pos;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame) return;
      last = 0;
      pos = el.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const visible = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visible.observe(el);

    const pause = () => {
      resumeAt = performance.now() + RESUME_AFTER;
    };
    // A vertical wheel scrolls the page past the row; only a sideways one pans it.
    const wheel = (e: WheelEvent) => {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) pause();
    };
    const touches = ["touchstart", "touchmove", "pointerdown", "keydown"] as const;
    el.addEventListener("wheel", wheel, { passive: true });
    for (const type of touches) el.addEventListener(type, pause, { passive: true });
    return () => {
      stop();
      visible.disconnect();
      el.removeEventListener("wheel", wheel);
      for (const type of touches) el.removeEventListener(type, pause);
    };
  }, [loops, held]);

  return (
    <div className={`h-full ${bleed ? "" : "fade-y"}`}>
      <div
        ref={scroller}
        data-at-start={fade === "both" || undefined}
        data-at-end={fade === "lead" || undefined}
        className={`pan-x flex h-full ${bleed ? "items-center-safe" : "items-center"} ${single ? "px-[calc(var(--pan-inset)/2)]" : "px-(--pan-inset)"} ${overflows ? "fade-x" : "justify-center-safe"}`}
      >
        <div className="flex shrink-0 items-center gap-(--pan-gap)">
          <div
            ref={set}
            className={`flex shrink-0 items-center gap-(--pan-gap) ${single ? "[&>*]:max-w-[calc(100cqw-var(--pan-inset))]" : ""}`}
          >
            {children}
          </div>
          {loops && (
            <div aria-hidden inert className="flex shrink-0 items-center gap-(--pan-gap)">
              {repeat}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
