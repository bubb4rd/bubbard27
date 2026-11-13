import { ArrowRight, ArrowUpRight, X } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, Suspense, ViewTransition } from "react";
import AppIcon from "@/components/AppIcon";
import { ChapterIndex, ChapterScope, Stage } from "@/components/case/Chapters";
import PageTransition from "@/components/PageTransition";
import MediaRail from "@/components/work/MediaRail";
import { copy } from "@/content/copy";
import type { RichText } from "@/data/projects";
import { blurFor } from "@/lib/blur";
import { caseStudies, chaptersOf, deviceOf, findProject } from "@/lib/work";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/work/[id]">): Promise<Metadata> {
  const found = findProject((await params).id);
  return found ? { title: found.project.title, description: found.project.description } : {};
}

const layout = "lg:grid lg:grid-cols-[minmax(20rem,27rem)_minmax(0,1fr)]";
const chapter = "flex scroll-mt-0 flex-col justify-center py-16 lg:min-h-[80svh]";

/**
 * A case study told in chapters: text scrolls on the left while a sticky stage
 * on the right blurs from one chapter's media to the next. Params are URL
 * data, so the study streams behind a skeleton of its own layout.
 */
export default function WorkPage({ params }: PageProps<"/work/[id]">) {
  return (
    <PageTransition>
      <Suspense fallback={<CaseSkeleton />}>
        <CaseStudy params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function CaseStudy({ params }: { params: PageProps<"/work/[id]">["params"] }) {
  const found = findProject((await params).id);
  if (!found) notFound();
  const { project, next } = found;
  const label = `${project.title}, ${project.subtitle}`;
  const device = deviceOf(project);
  const chapters = chaptersOf(project).map((c) => ({ ...c, media: c.media.map((m) => ({ ...m, blur: blurFor(m) })) }));

  return (
    <ChapterScope>
      {/* Viewport-sized twin of the project's catalog card: opening the card grows it to fill the screen. */}
      <ViewTransition name={`case-${project.id}`} share="morph" default="none">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-wall" />
      </ViewTransition>
      <div className={layout}>
        <div className="relative px-(--gutter)">
          {/* Pinned top band: text scrolling up fades out before it reaches the close button. */}
          <div className="pointer-events-none sticky top-0 z-20 -mx-(--gutter) bg-linear-to-b from-wall from-55% to-transparent px-(--gutter) pb-10 pt-(--gutter)">
            <Link
              href="/work"
              transitionTypes={["collapse"]}
              aria-label={copy.work.close}
              className="pointer-events-auto grid size-10 place-items-center rounded-full bg-mat ring-1 ring-line transition-transform duration-(--dur-base) ease-spring hover:scale-110"
            >
              <X size={16} weight="bold" aria-hidden />
            </Link>
          </div>

          {/* Extra bottom room on desktop keeps the centred header clear of the chapter index pinned below it. */}
          <header id="chapter-0" data-chapter={0} className={`${chapter} lg:min-h-[calc(100dvh-4rem)] lg:pb-48`}>
            <div className="flex items-center gap-4">
              <AppIcon src={project.icon} alt={`${project.title} icon`} size="4.5rem" morphId={project.id} priority />
              <div className="min-w-0">
                <h1 className="rise font-display text-title font-semibold">{project.title}</h1>
                <p className="rise mt-1.5 text-body font-medium">{project.subtitle}</p>
              </div>
            </div>
            <p className="rise mt-4 max-w-[46ch] text-body text-muted">{project.description}</p>

            {(project.href || project.links?.length) && (
              <div className="rise mt-6 flex flex-wrap gap-2">
                {project.href && (
                  <a href={project.href} target="_blank" rel="noopener noreferrer" className="pill pill-solid">
                    {project.href.includes("github.com") ? copy.work.sourceLink : copy.work.liveLink}
                    <ArrowUpRight size={14} weight="bold" aria-hidden />
                  </a>
                )}
                {project.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pill pill-soft">
                    {l.label}
                    <ArrowUpRight size={14} weight="bold" aria-hidden />
                  </a>
                ))}
              </div>
            )}

            <MediaRail media={project.media} device={device} label={label} className="-mx-(--gutter) mt-8 lg:hidden" />
          </header>

          {project.sections?.map((s, i) => (
            <section key={s.heading} id={`chapter-${i + 1}`} data-chapter={i + 1} className={chapter}>
              <h2 className="text-body font-medium">{s.heading}</h2>
              <p className="mt-3 max-w-[46ch] text-body text-muted">
                <Rich body={s.body} />
              </p>
              {s.media && <MediaRail media={s.media} device={device} label={label} className="-mx-(--gutter) mt-6 lg:hidden" />}
            </section>
          ))}

          <Link
            href={`/work/${next.id}`}
            prefetch
            transitionTypes={["nav-forward"]}
            className="group flex items-center gap-4 border-t border-line py-10"
          >
            <AppIcon src={next.icon} alt="" size="3rem" morphId={next.id} />
            <span>
              <span className="block text-caption text-muted">{copy.work.next}</span>
              <span className="flex items-center gap-2 font-display text-heading font-semibold">
                {next.title}
                <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform duration-(--dur-base) ease-spring group-hover:translate-x-1" />
              </span>
            </span>
          </Link>

          <ChapterIndex headings={chapters.map((c) => c.heading)} />
        </div>

        <Stage id={project.id} chapters={chapters} device={device} label={label} />
      </div>
    </ChapterScope>
  );
}

function Rich({ body }: { body: string | RichText }) {
  if (typeof body === "string") return body;
  return body.map((piece, i) =>
    typeof piece === "string" ? (
      <Fragment key={i}>{piece}</Fragment>
    ) : (
      <a
        key={i}
        href={piece.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink underline decoration-line underline-offset-4 transition-colors duration-(--dur-fast) hover:decoration-vermilion"
      >
        {piece.text}
      </a>
    ),
  );
}

/** Loading state: the text column and the stage as blank shapes. */
function CaseSkeleton() {
  return (
    <div aria-busy className={`${layout} animate-pulse`}>
      <div className="flex flex-col gap-4 px-(--gutter) pt-[30svh]">
        <div className="flex items-center gap-4">
          <div className="size-18 shrink-0 rounded-icon bg-line" />
          <div className="flex w-1/2 flex-col gap-2">
            <div className="h-9 rounded-full bg-line" />
            <div className="h-4 w-2/3 rounded-full bg-line" />
          </div>
        </div>
        <div className="h-24 w-full rounded-card bg-line" />
      </div>
      <div className="hidden h-dvh items-center gap-6 pl-12 lg:flex">
        <div className="h-[70svh] w-[22rem] rounded-[3rem] bg-line" />
        <div className="h-[70svh] w-[22rem] rounded-[3rem] bg-line" />
      </div>
    </div>
  );
}
