import type { CSSProperties } from "react";
import type { ProjectMedia } from "@/data/projects";
import { aspectRatio } from "@/lib/aspect";
import type { Device } from "@/lib/work";
import MediaFrame from "./MediaFrame";
import PhoneFrame, { PHONE_ASPECT, PHONE_BEZEL } from "./PhoneFrame";
import ScreenFrame, { SCREEN_ASPECT, SCREEN_BEZEL } from "./ScreenFrame";

/** A bleeding piece's height and its gap below the row's top, in cqh of the row. */
const BLEED_HEIGHT = 94;
const BLEED_TOP = 16;

/**
 * Bottom offset of a bleeding piece's clip control, read where the control
 * sits: cqh is the row's height, cqw its frame's width inside the bezel (a
 * container measures its content box). `base` above the row's bottom edge
 * while the foot is cut off, else `base` above the foot.
 */
function lift(aspect: number, bezel: number, base: string) {
  // The frame's full width is 100cqw / (1 - 2 * bezel); the screen's foot sits (1 / aspect - bezel) of that below the frame's top.
  const foot = (100 * (1 / aspect - bezel)) / (1 - 2 * bezel);
  return `max(${base}, calc(${BLEED_TOP}cqh + ${foot.toFixed(4)}cqw - 100cqh + ${base}))`;
}

/** A piece of project media with its blurred placeholder attached on the server. */
export type Showpiece = ProjectMedia & { blur?: string };

type Props = {
  media: Showpiece;
  /** The project's mockup (see `deviceOf`); a phone capture always gets the iPhone. */
  device: Device;
  label: string;
  /** Pause clips while offstage. */
  held?: boolean;
  /** Download a clip with the rest of its row as the row nears, even while held; off for a row's repeat. */
  warm?: boolean;
  /** Clip play/pause control; off inside links. */
  controls?: boolean;
  priority?: boolean;
  /** View-transition name a landing mockup morphs into (see "Landing to case" in globals.css). */
  morph?: string;
  /** A lone piece on a card: taller than the row, so its foot runs off the bottom edge. */
  bleed?: boolean;
};

/**
 * One piece in a showcase row, sized in container units of the row so every
 * piece of a kind is the same size: phones in an iPhone shell, everything on
 * a screen project in the same 16:10 display, artwork bare at one height.
 * A bleeding piece sits near the row's top at nearly twice the size, and its
 * clip control rises to stay in view.
 */
export default function ShowcaseItem({ media, device, label, held, warm, controls, priority, morph, bleed }: Props) {
  const frame = { label, held, warm, controls, priority, blur: media.blur };
  const named = morph ? { "data-morph": "" } : {};
  const placed = { "--morph": morph, marginTop: bleed ? `${BLEED_TOP}cqh` : undefined } as CSSProperties;

  if (device === "phone" || media.frame === "phone") {
    return (
      // A box-shadow on the shell's own rounded shape, not filter: drop-shadow(): Safari clips a filter's
      // shadow to the element's box inside the row's masked scroller, leaving hard lines and a grey rectangle.
      <div
        className="shrink-0 shadow-(--shadow-drop) [border-radius:13.68%/6.29%]"
        style={{ ...placed, height: `${bleed ? BLEED_HEIGHT : 76}cqh`, aspectRatio: PHONE_ASPECT, "--lift": lift(PHONE_ASPECT, PHONE_BEZEL, "6cqw") } as CSSProperties}
        {...named}
      >
        <PhoneFrame>
          <MediaFrame
            media={media}
            sizes="360px"
            fill
            position="50% 0%"
            controlClassName={`${bleed ? "bottom-(--lift)" : "bottom-[6cqw]"} right-[6cqw]`}
            {...frame}
          />
        </PhoneFrame>
      </div>
    );
  }
  if (device === "screen") {
    return (
      <div
        className="shrink-0"
        style={{ ...placed, width: `min(calc(${bleed ? BLEED_HEIGHT : 64}cqh * ${SCREEN_ASPECT.toFixed(4)}), 92cqw)`, "--lift": lift(SCREEN_ASPECT, SCREEN_BEZEL, "2cqw") } as CSSProperties}
        {...named}
      >
        <ScreenFrame>
          <MediaFrame
            media={media}
            sizes="(min-width: 1024px) 60vw, 100vw"
            fill
            fit="contain"
            controlClassName={`${bleed ? "bottom-(--lift)" : "bottom-[2cqw]"} right-[2cqw]`}
            {...frame}
          />
        </ScreenFrame>
      </div>
    );
  }
  const aspect = aspectRatio(media.aspect);
  return (
    <div
      className="@container shrink-0 overflow-hidden rounded-card ring-1 ring-line"
      style={{ ...placed, width: `min(calc(${bleed ? BLEED_HEIGHT : 66}cqh * ${aspect.toFixed(4)}), 92cqw)`, "--lift": lift(aspect, 0, "0.75rem") } as CSSProperties}
      {...named}
    >
      <MediaFrame media={media} sizes="(min-width: 1024px) 60vw, 100vw" controlClassName={bleed ? "bottom-(--lift) right-3" : undefined} {...frame} />
    </div>
  );
}
