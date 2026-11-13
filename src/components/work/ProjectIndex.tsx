"use client";

import posthog from "posthog-js";
import type { MouseEvent } from "react";
import AppIcon from "@/components/AppIcon";
import type { Project } from "@/data/projects";

/**
 * Every project as a logo and title. Each entry is an in-page link to its
 * card, which slides into view with a smooth scroll (an instant jump under
 * reduced motion) and takes focus when it can, so keyboard users land there.
 * Hover and focus styling lives in globals.css (.project-index).
 */
export default function ProjectIndex({ projects, label }: { projects: Pick<Project, "id" | "title" | "icon">[]; label: string }) {
  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const card = document.getElementById(id);
    if (!card) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    card.focus({ preventScroll: true });
    history.replaceState(history.state, "", `#${id}`);
    posthog.capture("project_index_selected", { project_id: id });
  }

  return (
    <nav aria-label={label} className="project-index rise -mx-2 mt-8 min-h-0 overflow-y-auto">
      <ul className="flex flex-col gap-1 py-1">
        {projects.map((p) => (
          <li key={p.id}>
            <a
              href={`#${p.id}`}
              onClick={(e) => go(e, p.id)}
              className="index-entry flex items-center gap-2.5 px-2 py-1 text-body"
            >
              <AppIcon src={p.icon} alt="" size="1.5rem" />
              <span className="index-entry-title">{p.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
