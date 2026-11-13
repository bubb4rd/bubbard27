import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import AppIcon from "@/components/AppIcon";
import PageTransition from "@/components/PageTransition";
import ProjectIndex from "@/components/work/ProjectIndex";
import Showreel from "@/components/work/Showreel";
import { copy } from "@/content/copy";
import { projects, type Project } from "@/data/projects";

export const metadata: Metadata = { title: copy.catalog.title };

const navLink = "transition-colors duration-(--dur-fast) hover:text-ink";

/** Everything: a pinned introduction with an index of projects, and one card per project. */
export default function WorkIndex() {
  return (
    <PageTransition>
      <div className="grid gap-x-(--gutter) px-(--gutter) lg:grid-cols-[minmax(15rem,19rem)_minmax(0,1fr)]">
        <aside className="flex flex-col py-(--gutter) lg:sticky lg:top-0 lg:h-dvh">
          <p className="rise flex items-center gap-[0.3em] text-body text-muted">
            {copy.catalog.role}
            <span className="app-icon block size-[1.25em]">
              <Image src="/images/bubbard-logo.png" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <strong className="font-bold">{copy.catalog.brand}</strong>
          </p>
          <p className="rise mt-4 max-w-[36ch] text-body text-muted">{copy.catalog.intro}</p>
          <ProjectIndex projects={projects.map(({ id, title, icon }) => ({ id, title, icon }))} label={copy.catalog.index} />
          <nav className="mt-8 flex gap-5 text-caption text-muted lg:mt-auto">
            <Link href="/" transitionTypes={["nav-back"]} className={navLink}>
              {copy.catalog.nav.home}
            </Link>
            <span aria-current="page" className="text-ink">
              {copy.catalog.nav.work}
            </span>
            <a href="/cv.pdf" download={copy.dock.cvFile} className={navLink}>
              {copy.catalog.nav.cv}
            </a>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col gap-6 pb-(--gutter) lg:pt-(--gutter)">
          {projects.map((p, i) => (
            <Card key={p.id} project={p} priority={i === 0} />
          ))}
        </main>
      </div>
    </PageTransition>
  );
}

/**
 * A project card: the same colour as the page, drawn by a hairline. Name and
 * one-liner pinned top left, the work in a looping row centred across the
 * rest of the card. Opening it grows the card to fill the screen as the case
 * study arrives; a coming-soon card has no case study, so it doesn't open.
 */
function Card({ project, priority }: { project: Project; priority: boolean }) {
  // The id is the target of the project index; the margin keeps the card off the viewport edge when it lands.
  const className = "sheet flex flex-col scroll-mt-(--gutter) overflow-hidden lg:h-[clamp(420px,80svh,800px)]";
  // Shared shape; the 1px border keeps grey and outlined chips the same height.
  const chip = "rounded-full border px-2 py-0.5 text-micro";
  const soft = `${chip} border-transparent bg-ink/6 font-normal text-muted`;
  const body = (
    <>
      <div className="flex items-center gap-3 px-(--pad) pt-(--pad)">
        <AppIcon
          src={project.icon}
          alt={`${project.title} icon`}
          size="2.75rem"
          morphId={project.comingSoon ? undefined : project.id}
          priority={priority}
        />
        <div className="min-w-0">
          {/* Chips stay together on one line; on a narrow card they drop below the title as a group. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="font-display text-heading font-semibold">{project.title}</h2>
            {(project.badge || project.comingSoon) && (
              <span className="flex shrink-0 items-center gap-2">
                {project.badge && (
                  <span className={`${chip} border-ember bg-ember/10 font-semibold uppercase text-ember`}>{project.badge}</span>
                )}
                {project.comingSoon && <span className={`${soft} whitespace-nowrap`}>{copy.catalog.comingSoon}</span>}
              </span>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-body font-medium">
            {project.subtitle}
            {project.upcoming && <span className={soft}>{copy.catalog.upcoming}</span>}
          </p>
        </div>
      </div>
      <div className="h-[clamp(22rem,60svh,32rem)] min-w-0 [container-type:size] lg:h-auto lg:min-h-0 lg:flex-1">
        <Showreel project={project} priority={priority} controls={project.comingSoon} />
      </div>
    </>
  );

  // tabIndex lets the index move focus here, though the card itself isn't interactive.
  if (project.comingSoon)
    return (
      <article id={project.id} tabIndex={-1} className={`${className} outline-none`}>
        {body}
      </article>
    );
  return (
    <ViewTransition name={`case-${project.id}`} share="morph" default="none">
      <Link id={project.id} href={`/work/${project.id}`} prefetch transitionTypes={["expand"]} className={className}>
        {body}
      </Link>
    </ViewTransition>
  );
}
