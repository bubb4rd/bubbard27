import type { Project } from "@/data/projects";
import { blurFor } from "@/lib/blur";
import { deviceOf } from "@/lib/work";
import Carousel from "./Carousel";
import ShowcaseItem from "./ShowcaseItem";

/**
 * Every piece of a project in one rolling row for its catalog card, all in
 * the project's one mockup: a screen project leaves its phone captures to
 * their case-study chapters. A lone piece bleeds: larger, running off the
 * card's bottom edge. Clips have no controls on cards that link, since a
 * button can't nest inside one.
 */
export default function Showreel({ project, priority, controls = false }: { project: Project; priority: boolean; controls?: boolean }) {
  const device = deviceOf(project);
  const media = [...project.media, ...(project.sections ?? []).flatMap((s) => s.media ?? [])]
    .filter((m) => device !== "screen" || m.frame !== "phone")
    .map((m) => ({ ...m, blur: blurFor(m) }));
  const bleed = media.length === 1;
  const label = `${project.title}, ${project.subtitle}`;
  const row = (copy: boolean) =>
    media.map((m, i) => (
      <ShowcaseItem
        key={i}
        media={m}
        device={device}
        label={label}
        controls={controls}
        warm={!copy}
        priority={!copy && priority && i < 2}
        bleed={bleed}
      />
    ));

  return (
    <Carousel repeat={row(true)} bleed={bleed}>
      {row(false)}
    </Carousel>
  );
}
