"use client";

import { createContext, use, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
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
 * Only the layers next to the reader are mounted, so a case study loads its
 * media a chapter ahead instead of all at once; their clips download while
 * still offstage, ready to play when their chapter arrives. The overview's
 * pieces are named landing-<id>-<n>, so the mockups of an opened landing
 * feature land in them.
 */
export function Stage({ id, chapters, device, label }: { id: string; chapters: Chapter[]; device: Device; label: string }) {
  const active = use(ActiveChapter);
  let shown = active;
  while (shown > 0 && chapters[shown].media.length === 0) shown--;

  return (
    <div className="sticky top-0 hidden h-dvh overflow-hidden lg:block">
      {chapters.map((c, i) =>
        c.media.length && (i === shown || Math.abs(i - active) <= 1) ? (
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
  // The row's repeat never fetches ahead: it plays from what the first pass already downloaded.
  const row = (copy: boolean) =>
    media.map((m, i) => (
      <ShowcaseItem
        key={i}
        media={m}
        device={device}
        label={label}
        held={!active}
        warm={!copy}
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
 * so text scrolling underneath never shows through. Past five chapters the
 * list scrolls on its own (wheel or trackpad over it, or keyboard focus), a
 * soft fade marks each end with more past it, and it glides to keep the
 * chapter being read in its middle, as on gianlucreates.
 * A link glides up or down to its chapter and stops with it centred, where
 * the index and the stage count it as the one being read.
 */
export function ChapterIndex({ headings }: { headings: string[] }) {
  const active = use(ActiveChapter);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const edges = () => {
      el.toggleAttribute("data-at-start", el.scrollTop <= 1);
      el.toggleAttribute("data-at-end", el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
    };
    edges();
    el.addEventListener("scroll", edges, { passive: true });
    // The index is display: none below lg, so its size (and whether it overflows) changes with the window.
    const resize = new ResizeObserver(edges);
    resize.observe(el);
    return () => {
      el.removeEventListener("scroll", edges);
      resize.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = list.current;
    const item = el?.children[active] as HTMLElement | undefined;
    if (!el || !item || el.scrollHeight <= el.clientHeight) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: item.offsetTop - (el.clientHeight - item.offsetHeight) / 2, behavior: reduced ? "instant" : "smooth" });
  }, [active]);

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
      {/* Five rows and their gaps, plus the padding that keeps focus outlines inside the scroller. */}
      <ol ref={list} data-at-start className="pan-y fade-list relative -m-1 max-h-[calc(5lh_+_4*0.375rem_+_0.5rem)] space-y-1.5 p-1 text-caption">
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
