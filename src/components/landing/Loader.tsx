"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import { cubeCss, faces } from "@/components/landing/cube";

/** The B for the cube's right face, made by scripts/cube-face.mjs. */
const face = "/images/bubbard-cube-face.png";
const sides = Object.keys(faces);
/** Past this, the loader lets go even if a slow asset never settles. */
const maxWait = 3000;

const subscribe = () => () => {};

/**
 * The landing's first-load cover: the BUBBARD logo built as a real cube, tumbling on ink while the page loads
 * underneath. It tumbles in cycles and lets go at the end of the first cycle after the window has loaded
 * (images, fonts), so it always comes to rest as the logo, then fades as the page rises in (the .rise
 * animations stay paused while it is up, see globals.css).
 *
 * Only on a real page load: when the landing is reached by client navigation, the page is already warm.
 */
export default function Loader() {
  // True only while hydrating server HTML; a client-side render reads false.
  const hydrating = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );
  const [phase, setPhase] = useState<"spin" | "exit" | "gone">(() => (hydrating ? "spin" : "gone"));
  const ready = useRef(false);

  preload(face, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    if (phase !== "spin") return;
    let cancelled = false;
    const release = () => {
      if (cancelled) return;
      // Without motion there is no cycle to finish.
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("gone");
      else ready.current = true;
    };
    const timer = setTimeout(release, maxWait);
    const { promise: loaded, resolve } = Promise.withResolvers<void>();
    const onLoad = () => resolve();
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", onLoad, { once: true });
    Promise.all([loaded, document.fonts.ready]).then(release);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="loader"
      data-done={phase === "exit" ? "" : undefined}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setPhase("gone");
      }}
    >
      {/* Server and browser may round the last digit of a sine differently. */}
      <style suppressHydrationWarning>{cubeCss}</style>
      <span className="loader-cube">
        <span
          className="loader-spin"
          onAnimationIteration={() => {
            if (ready.current) setPhase("exit");
          }}
        >
          {sides.map((side) => (
            <span key={side} className="loader-face" data-face={side}>
              {side === "right" && <span className="loader-b" style={{ maskImage: `url(${face})` }} />}
            </span>
          ))}
        </span>
        {/* The same cube again, all white, blurred and cut back to a hard edge: its outline with the corners
            rounded, as the logo's are. Darkened over the cube above, it trims that cube's square corners away,
            whatever it turns to. */}
        <span className="loader-trim">
          <span className="loader-spin">
            {sides.map((side) => (
              <span key={side} className="loader-face" data-face={side} />
            ))}
          </span>
        </span>
      </span>
      {/* Nothing would ever lift the cover without JavaScript. */}
      <noscript>
        <style>{".loader{display:none}.rise{animation-play-state:running!important}"}</style>
      </noscript>
    </div>
  );
}
