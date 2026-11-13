import type { ReactNode } from "react";

/** Bezel on every side, as a share of the frame's width. */
const BEZEL = 0.018;

/** Width / height of the framed screen: a 16:10 display inside an even bezel. */
export const SCREEN_ASPECT = 1 / ((1 - 2 * BEZEL) / 1.6 + 2 * BEZEL);

/**
 * A desktop or web capture on a plain dark display: even black bezel,
 * rounded corners, a camera dot, no stand. The display is always 16:10, so
 * every screen in a row is the same size; media of another shape is shown
 * whole, with the leftover edge in the bezel's black. Sized in container
 * units of its own width, so it scales cleanly at any size.
 */
export default function ScreenFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="@container relative w-full bg-device shadow-(--shadow-lifted) [border-radius:2.6%/4.07%]"
      style={{ aspectRatio: SCREEN_ASPECT, padding: `${BEZEL * 100}%` }}
    >
      <span aria-hidden className="absolute left-1/2 top-[0.6cqw] size-[0.6cqw] -translate-x-1/2 rounded-full bg-white/10" />
      <div className="relative h-full w-full overflow-hidden rounded-[0.8cqw] bg-device">{children}</div>
    </div>
  );
}
