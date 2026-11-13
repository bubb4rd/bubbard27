import type { ReactNode } from "react";

/** Width / height of the framed phone (a 402 × 874 point iPhone). */
export const PHONE_ASPECT = 402 / 874;

/**
 * A phone screenshot or screen recording in a plain dark iPhone shell: thin
 * bezel, rounded display, Dynamic Island, no buttons. Sized in container
 * units of its own width, so it scales cleanly at any size. The screen crops
 * to the top of the media, keeping the status bar under the island.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="@container relative w-full overflow-hidden bg-device p-[2.8%] [border-radius:13.68%/6.29%]"
      style={{ aspectRatio: PHONE_ASPECT }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[10.9cqw] bg-device">
        {children}
        {/* Sized to just cover the island a simulator screenshot already has, so the two never show doubled. */}
        <span aria-hidden className="absolute left-1/2 top-[3.2cqw] h-[9.2cqw] w-[30.8cqw] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
