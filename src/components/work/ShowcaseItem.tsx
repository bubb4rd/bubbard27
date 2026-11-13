import type { CSSProperties } from "react";
import type { ProjectMedia } from "@/data/projects";
import { aspectRatio } from "@/lib/aspect";
import type { Device } from "@/lib/work";
import MediaFrame from "./MediaFrame";
import PhoneFrame, { PHONE_ASPECT } from "./PhoneFrame";
import ScreenFrame, { SCREEN_ASPECT } from "./ScreenFrame";

/** A piece of project media with its blurred placeholder attached on the server. */
export type Showpiece = ProjectMedia & { blur?: string };

type Props = {
  media: Showpiece;
  /** The project's mockup (see `deviceOf`); a phone capture always gets the iPhone. */
  device: Device;
  label: string;
  /** Pause clips while offstage. */
  held?: boolean;
  /** Clip play/pause control; off inside links. */
  controls?: boolean;
  priority?: boolean;
  /** View-transition name a landing mockup morphs into (see "Landing to case" in globals.css). */
  morph?: string;
};

/**
 * One piece in a showcase row, sized in container units of the row so every
 * piece of a kind is the same size: phones in an iPhone shell, everything on
 * a screen project in the same 16:10 display, artwork bare at one height.
 */
export default function ShowcaseItem({ media, device, label, held, controls, priority, morph }: Props) {
  const frame = { label, held, controls, priority, blur: media.blur };
  const named = morph ? { "data-morph": "" } : {};
  const name = morph ? ({ "--morph": morph } as CSSProperties) : undefined;

  if (device === "phone" || media.frame === "phone") {
    return (
      <div className="h-[76cqh] shrink-0 drop-shadow-(--shadow-drop)" style={{ ...name, aspectRatio: PHONE_ASPECT }} {...named}>
        <PhoneFrame>
          <MediaFrame media={media} sizes="360px" fill position="50% 0%" controlClassName="bottom-[6cqw] right-[6cqw]" {...frame} />
        </PhoneFrame>
      </div>
    );
  }
  if (device === "screen") {
    return (
      <div className="shrink-0" style={{ ...name, width: `min(calc(64cqh * ${SCREEN_ASPECT.toFixed(4)}), 92cqw)` }} {...named}>
        <ScreenFrame>
          <MediaFrame media={media} sizes="(min-width: 1024px) 60vw, 100vw" fill fit="contain" controlClassName="bottom-[2cqw] right-[2cqw]" {...frame} />
        </ScreenFrame>
      </div>
    );
  }
  return (
    <div
      className="shrink-0 overflow-hidden rounded-card ring-1 ring-line"
      style={{ ...name, width: `min(calc(66cqh * ${aspectRatio(media.aspect).toFixed(4)}), 92cqw)` }}
      {...named}
    >
      <MediaFrame media={media} sizes="(min-width: 1024px) 60vw, 100vw" {...frame} />
    </div>
  );
}
