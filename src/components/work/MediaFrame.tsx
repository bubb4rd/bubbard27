"use client";

import Image, { getImageProps } from "next/image";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/content/copy";
import type { ProjectMedia } from "@/data/projects";
import { aspectRatio } from "@/lib/aspect";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { logPortfolioInteraction } from "@/lib/posthogLogger";
import { useSaveData } from "@/lib/useSaveData";

/** AV1 in MP4; level 4.0 covers 1080p at 30 fps, so browsers without hardware for it pick the H.264 source. */
const AV1 = 'video/mp4; codecs="av01.0.08M.08"';

/**
 * The image optimizer's URL for a clip's poster about `width` device pixels
 * wide, so the still shown before a clip plays is a resized WebP or AVIF
 * rather than the full-size JPEG.
 */
function posterUrl(src: string, width: number) {
  const { srcSet = "" } = getImageProps({ src, alt: "", fill: true, sizes: `${width}px` }).props;
  const candidates = srcSet.split(", ").map((c) => {
    const [url, w] = c.split(" ");
    return { url, w: parseInt(w) };
  });
  return (candidates.find((c) => c.w >= width) ?? candidates.at(-1))?.url ?? src;
}

type Props = {
  media: ProjectMedia;
  /** Alt text when the media has none of its own. */
  label: string;
  sizes: string;
  /** "contain" shows the media whole, the parent showing through any letterbox; "cover" crops it to fill. */
  fit?: "cover" | "contain";
  /** Fill the positioned parent instead of reserving the media's own aspect ratio. */
  fill?: boolean;
  priority?: boolean;
  /** CSS object-position for cropped media, e.g. a project's `focus`. */
  position?: string;
  /** Where the play/pause control sits inside the frame. */
  controlClassName?: string;
  /** Keeps a clip paused while it is offstage, e.g. on a hidden case-study stage layer. */
  held?: boolean;
  /** Download the clip with the rest of its row as the row nears, even while held; off for a row's repeat. */
  warm?: boolean;
  /** Tiny data URL shown blurred until the media has loaded (from data/blur.json). */
  blur?: string;
  /** Show the play/pause control on clips. Off inside links, where a button can't nest. */
  controls?: boolean;
  className?: string;
};

/**
 * One image or muted looping clip over a blurred placeholder; images fade in
 * once loaded. Clips download as their row comes within half a screen (a
 * row's repeat only once it is on screen), play only while on screen, and
 * start paused under reduced motion or data saver.
 */
export default function MediaFrame({
  media,
  label,
  sizes,
  fit = "cover",
  fill = false,
  priority = false,
  position,
  controlClassName = "bottom-3 right-3",
  held = false,
  warm = false,
  blur,
  controls = true,
  className = "",
}: Props) {
  const contain = fit === "contain";
  const fitClass = contain ? "object-contain" : "object-cover";
  const objectStyle = position ? { objectPosition: position } : undefined;

  return (
    <div
      className={`${fill ? "absolute inset-0" : "relative w-full"} overflow-hidden ${contain ? "" : "bg-line"} ${className}`}
      style={fill ? undefined : { aspectRatio: media.aspect }}
    >
      {blur && !contain && (
        <div
          aria-hidden
          className="absolute inset-0 scale-105 bg-cover bg-center blur-md"
          style={{ backgroundImage: `url(${blur})` }}
        />
      )}
      {media.type === "video" ? (
        <Clip
          media={media}
          label={label}
          fitClass={fitClass}
          objectStyle={objectStyle}
          controlClassName={controlClassName}
          held={held}
          warm={warm}
          controls={controls}
        />
      ) : (
        <Still media={media} alt={media.alt ?? label} sizes={sizes} priority={priority} className={fitClass} style={objectStyle} />
      )}
    </div>
  );
}

function Still({
  media,
  alt,
  sizes,
  priority,
  className,
  style,
}: {
  media: ProjectMedia;
  alt: string;
  sizes: string;
  priority: boolean;
  className: string;
  style?: { objectPosition: string };
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={media.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-(--dur-base) ${loaded ? "opacity-100" : "opacity-0"}`}
      style={style}
    />
  );
}

function Clip({
  media,
  label,
  fitClass,
  objectStyle,
  controlClassName,
  held,
  warm,
  controls,
}: {
  media: ProjectMedia;
  label: string;
  fitClass: string;
  objectStyle?: { objectPosition: string };
  controlClassName: string;
  held: boolean;
  warm: boolean;
  controls: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const saveData = useSaveData();
  // null follows the motion and data preferences; a press on the control overrides them.
  const [choice, setChoice] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const allowed = choice ?? !(reduced || saveData);
  const wantsPlay = !held && allowed;
  const wantsLoad = allowed && (warm || !held);

  // preload="none" holds the download until the clip's row is within half a screen, so pieces further
  // along the row are ready before they roll in. A repeat (not warm) waits until it is on screen itself,
  // and by then plays from what its original already downloaded.
  useEffect(() => {
    const video = ref.current;
    if (!video || !wantsLoad) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = "auto";
        observer.disconnect();
      },
      { rootMargin: warm ? "50% 0px" : "0px" },
    );
    observer.observe(warm ? (video.closest("[data-row]") ?? video) : video);
    return () => observer.disconnect();
  }, [wantsLoad, warm]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only act on a change, so a play started by the control isn't restarted outside the click.
        if (entry.isIntersecting && wantsPlay) {
          if (video.paused) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [wantsPlay]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    // Call play() inside the click: browsers that refused autoplay (iOS Low Power Mode) allow it here.
    if (video.paused) {
      setChoice(true);
      video.play().catch(() => {});
      posthog.capture("media_playback_toggled", { action: "play" });
      logPortfolioInteraction("media playback control used", { action: "play" });
    } else {
      setChoice(false);
      video.pause();
      posthog.capture("media_playback_toggled", { action: "pause" });
      logPortfolioInteraction("media playback control used", { action: "pause" });
    }
  }

  return (
    <>
      <video
        ref={ref}
        poster={media.poster && posterUrl(media.poster, aspectRatio(media.aspect) < 1 ? 720 : 1200)}
        aria-label={media.alt ?? label}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 h-full w-full ${fitClass}`}
        style={objectStyle}
      >
        {/* The first matching source wins: AV1 where it plays, then phones get the 720p rendition when there is one. */}
        {media.av1 && <source src={media.av1} type={AV1} />}
        {media.small && <source src={media.src} type="video/mp4" media="(min-width: 768px)" />}
        <source src={media.small ?? media.src} type="video/mp4" />
      </video>
      {controls && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `${copy.work.pause} clip` : `${copy.work.play} clip`}
          className={`pill pill-soft absolute ${controlClassName} bg-mat/85 backdrop-blur`}
        >
          {playing ? copy.work.pause : copy.work.play}
        </button>
      )}
    </>
  );
}
