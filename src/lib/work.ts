import { copy } from "@/content/copy";
import { projects, type Project } from "@/data/projects";

/** Projects with a case study page; coming-soon ones only show in the catalog. */
export const caseStudies = projects.filter((p) => !p.comingSoon);

export function findProject(id: string) {
  const index = caseStudies.findIndex((p) => p.id === id);
  if (index === -1) return null;
  return { project: caseStudies[index], next: caseStudies[(index + 1) % caseStudies.length] };
}

/** A case study's chapters: the overview, then each section. */
export function chaptersOf(p: Project) {
  return [
    { heading: copy.work.overview, media: p.media },
    ...(p.sections ?? []).map((s) => ({ heading: s.heading, media: s.media ?? [] })),
  ];
}

/**
 * A project's outbound links for its catalog card: the main link, then the
 * rest. A GitHub repo gets the GitHub mark only beside another link, such as
 * the live site; a project with a single link shows it as a plain arrow.
 * `repo` still names a lone repo link for what it is.
 */
export function outboundOf(p: Pick<Project, "href" | "links">) {
  const hrefs = [p.href, ...(p.links ?? []).map((l) => l.href)].filter((h): h is string => Boolean(h));
  return hrefs.map((href) => {
    const repo = new URL(href).hostname === "github.com";
    return { href, repo, githubMark: repo && hrefs.length > 1 };
  });
}

/**
 * How a project's media is mocked up, the same for every piece: iOS apps in
 * an iPhone, design work as bare artwork, everything else on a 16:10 screen.
 * A piece marked `frame: "phone"` is a phone capture and always gets the iPhone.
 */
export type Device = "phone" | "screen" | "art";

export function deviceOf(p: Pick<Project, "kind">): Device {
  if (p.kind === "iOS Development") return "phone";
  if (p.kind === "Design") return "art";
  return "screen";
}
