"use client";

import { createContext, use, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import Carousel from "@/components/work/Carousel";
import ShowcaseItem, { type Showpiece } from "@/components/work/ShowcaseItem";
import type { Device } from "@/lib/work";

type Chapter = { heading: string; media: Showpiece[] };

const ActiveChapter = createContext(0);

/**
 * Tracks which chapter (an element with data-chapter="n") crosses the middle
 * of the viewport, for the stage and the index.
 */
export function ChapterScope({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.chapter));
        }
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <ActiveChapter value={active}>{children}</ActiveChapter>;
}

/**
 * Sticky media stage: one layer per chapter, the active one in focus and the
 * rest blurred away. A chapter without media keeps the previous layer up.
 * The overview's pieces are named landing-<id>-<n>, so the mockups of an
 * opened landing feature land in them.
 */
export function Stage({ id, chapters, device, label }: { id: string; chapters: Chapter[]; device: Device; label: string }) {
  let shown = use(ActiveChapter);
  while (shown > 0 && chapters[shown].media.length === 0) shown--;

  return (
    <div className="sticky top-0 hidden h-dvh overflow-hidden lg:block">
      {chapters.map((c, i) =>
        c.media.length ? (
          <Layer
            key={i}
            media={c.media}
            device={device}
            active={i === shown}
            label={label}
            priority={i === 0}
            morph={i === 0 ? `landing-${id}` : undefined}
          />
        ) : null,
      )}
    </div>
  );
}

type LayerProps = { media: Showpiece[]; device: Device; active: boolean; label: string; priority: boolean; morph?: string };

/** One chapter's media as a rolling row the reader can pan sideways. */
function Layer({ media, device, active, label, priority, morph }: LayerProps) {
  const row = (copy: boolean) =>
    media.map((m, i) => (
      <ShowcaseItem
        key={i}
        media={m}
        device={device}
        label={label}
        held={!active}
        priority={!copy && priority}
        morph={copy || !morph ? undefined : `${morph}-${i}`}
      />
    ));
  return (
    <div data-active={active || undefined} aria-hidden={!active} inert={!active} className="stage-layer absolute inset-0 py-[6svh] [container-type:size]">
      <Carousel held={!active} repeat={row(true)}>
        {row(false)}
      </Carousel>
    </div>
  );
}

/**
 * The chapter index pinned to the bottom of the text column. Its backdrop is
 * solid behind the list and fades only across the top padding (pt-20 = 5rem),
 * so text scrolling underneath never shows through, however many chapters.
 * A link glides up or down to its chapter and stops with it centred, where
 * the index and the stage count it as the one being read.
 */
export function ChapterIndex({ headings }: { headings: string[] }) {
  const active = use(ActiveChapter);

  function go(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(e.currentTarget.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
    history.replaceState(history.state, "", e.currentTarget.hash);
  }

  return (
    <nav className="sticky bottom-0 hidden bg-linear-to-t from-wall from-[calc(100%-5rem)] to-transparent pb-(--gutter) pt-20 lg:block">
      <ol className="space-y-1.5 text-caption">
        {headings.map((heading, i) => (
          <li key={heading}>
            <a
              href={`#chapter-${i}`}
              onClick={go}
              aria-current={i === active ? "step" : undefined}
              className={`transition-colors duration-(--dur-base) hover:text-ink ${i === active ? "text-ink" : "text-muted/70"}`}
            >
              {heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
