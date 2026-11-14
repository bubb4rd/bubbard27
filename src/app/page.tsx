import { ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import AppIcon from "@/components/AppIcon";
import ContactLinks from "@/components/landing/ContactLinks";
import FeatureTitle from "@/components/landing/FeatureTitle";
import Loader from "@/components/landing/Loader";
import { Pieces } from "@/components/landing/PieceView";
import PageTransition from "@/components/PageTransition";
import MediaFrame from "@/components/work/MediaFrame";
import { copy } from "@/content/copy";
import { features } from "@/content/featured";
import { profile } from "@/data/profile";
import { type ProjectMedia, projects } from "@/data/projects";
import { blurFor } from "@/lib/blur";

/** The projects in the recent column, newest first, each with its wide cover and its hover choreography. */
const recent = [
  { id: "elovatesr", cover: "/images/elovate-long.jpg" },
  { id: "gliide", cover: "/images/gliide-app-long.jpg" },
  { id: "vaultair", cover: "/images/vaultair-long.jpg" },
  { id: "wkcc-perks", cover: "/images/wkcc-long.png" },
].flatMap(({ id, cover }) => {
  const project = projects.find((p) => p.id === id);
  return project ? [{ project, cover, feature: features.find((f) => f.id === id) }] : [];
});

/**
 * Where the name comes from: BO HUBBARD squeezed into BUBBARD (videos/bubbard-name-slam), cropped to the band
 * around the lockup. Its poster is the last frame, the finished lockup.
 */
const brandClip: ProjectMedia = {
  type: "video",
  src: "/media/bubbard/name-slam.mp4",
  av1: "/media/bubbard/name-slam-av1.mp4",
  aspect: "1920/720",
  poster: "/media/bubbard/name-slam.jpg",
};

const step = (i: number) => ({ "--i": i }) as CSSProperties;
const navLink = "transition-colors duration-(--dur-fast) hover:text-ink";

/**
 * The landing page. On wide screens the work scrolls on the left while Bo
 * stays pinned on the right, portrait over a short bio and every way to reach
 * him. Below lg the two simply stack.
 */
export default function Home() {
  return (
    <PageTransition>
      <Loader />
      <div className="mx-auto grid max-w-[110rem] gap-x-[calc(var(--gutter)*2)] px-(--gutter) lg:grid-cols-[minmax(0,1fr)_clamp(21rem,30vw,28rem)] lg:grid-rows-[auto_auto_1fr]">
        {/* Once the columns stack: header, headline, portrait, then the work. On wide screens header and
            headline sit atop the work column, the portrait beside all three. */}
        <header className="rise order-first flex items-center justify-between pt-(--gutter) lg:order-none lg:col-start-1 lg:row-start-1" style={step(0)}>
          <p data-dither-clear className="flex items-center gap-2.5">
            <span className="app-icon block size-8">
              <Image src="/images/bubbard-logo.png" alt="" fill sizes="64px" priority className="object-cover" />
            </span>
            <span className="wordmark text-lead">{copy.landing.brand}</span>
          </p>
          <nav data-dither-clear className="flex gap-5 text-caption text-muted">
            <Link href="/work" transitionTypes={["nav-forward"]} className={navLink}>
              {copy.catalog.nav.work}
            </Link>
            <a href="/cv.pdf" download={copy.site.cvFile} className={navLink}>
              {copy.catalog.nav.cv}
            </a>
          </nav>
        </header>

        {/* On phones the type scales with the column: "Developer+Designer" (about 9.1em, unbreakable) runs to just short of the padding. */}
        <h1
          data-dither-clear
          className="rise order-first mt-[clamp(4rem,14svh,8rem)] mb-[clamp(1.5rem,5svh,2.5rem)] max-w-[24ch] font-display text-title font-semibold text-balance max-sm:text-[calc((100vw-var(--gutter)*2)/9.4)] lg:order-none lg:col-start-1 lg:row-start-2 lg:mb-0"
          style={step(1)}
        >
          {copy.landing.title.roles[0]}
          <span className="text-vermilion">+</span>
          {copy.landing.title.roles[1]}{" "}
          {/* Willis Tower, Carol M. Highsmith for the Library of Congress (public domain). Kept on a line with the city. */}
          <span className="whitespace-nowrap">
            <span className="relative inline-block h-[0.9em] w-[2.6em] overflow-hidden rounded-[0.08em] align-[-0.1em]">
              <Image src="/images/chicago-willis-wide.jpg" alt="" fill sizes="128px" className="object-cover" />
            </span>{" "}
            {copy.landing.title.city}
          </span>{" "}
          {copy.landing.title.rest}
        </h1>

        <main className="flex min-w-0 flex-col pb-(--gutter) lg:col-start-1 lg:row-start-3">
          <section aria-labelledby="recent" className="rise mt-[clamp(3.5rem,10svh,6rem)]" style={step(2)}>
            <div data-dither-floor className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 id="recent" data-dither-clear className="caps text-muted">
                {copy.landing.recent}
              </h2>
              <Link data-dither-clear href="/work" transitionTypes={["nav-forward"]} className={`caps text-muted ${navLink}`}>
                {copy.landing.allWork} ({projects.length})
              </Link>
            </div>

            <ul className="recent-grid mt-6 grid gap-x-(--gutter) gap-y-10 xl:grid-cols-2">
              {recent.map(({ project: p, cover, feature }, i) => (
                <li key={p.id}>
                  {/* A project with a hover choreography: its mockups and live
                      widgets spring up out of the cover, its name turns into its own face, and opening it flies
                      the mockups into the case study's stage (from-landing). */}
                  <Link
                    href={`/work/${p.id}`}
                    transitionTypes={feature ? ["nav-forward", "from-landing"] : ["nav-forward"]}
                    className={`recent-card group relative block ${feature ? "feature" : ""}`}
                  >
                    <span className="@container relative block">
                      <span className="sheet relative block aspect-[16/10] overflow-hidden rounded-card">
                        <Image
                          src={cover}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 60vw, 100vw"
                          priority={i < 2}
                          placeholder="blur"
                          blurDataURL={blurFor({ type: "image", src: cover, aspect: "16/10" })}
                          className="recent-cover object-cover"
                        />
                      </span>
                      {feature && (
                        <span aria-hidden className="recent-stage absolute inset-x-0 bottom-[8%] isolate h-0">
                          <Pieces pieces={feature.pieces} morphId={p.id} />
                        </span>
                      )}
                    </span>
                    <span className="mt-4 flex items-center gap-3">
                      <AppIcon src={p.icon} alt="" size="2.25rem" morphId={p.id} />
                      <span className="recent-title min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="grid text-body">
                            <span className="recent-name col-start-1 row-start-1 font-display font-semibold">{p.title}</span>
                            {feature && (
                              <span aria-hidden className="recent-face col-start-1 row-start-1">
                                <FeatureTitle feature={feature} />
                              </span>
                            )}
                          </span>
                          {p.upcoming && (
                            <span className="rounded-full bg-ink/6 px-2 py-0.5 text-micro text-muted">{copy.catalog.upcoming}</span>
                          )}
                        </span>
                        <span className="block text-caption text-muted">{p.subtitle}</span>
                      </span>
                      {p.year && <span className="caps text-muted">{p.year}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="about" className="rise mt-[clamp(4rem,12svh,7rem)]" style={step(3)}>
            <h2 id="about" className="caps border-b border-line pb-3 text-muted">
              {copy.landing.about}
            </h2>
            <p className="mt-6 max-w-[58ch] text-lead text-pretty">{copy.landing.aboutBody}</p>
            <div className="mt-8 overflow-hidden rounded-card">
              <MediaFrame media={brandClip} label={copy.landing.brandClip} sizes="(min-width: 1024px) 60vw, 100vw" blur={blurFor(brandClip)} />
            </div>
          </section>

          <footer className="mt-auto flex items-center justify-between gap-4 pt-[clamp(4rem,12svh,7rem)]">
            <Link href="/work" transitionTypes={["nav-forward"]} className="pill pill-solid">
              {copy.landing.allWork}
              <span className="text-mat/60">{projects.length}</span>
              <ArrowRight size={14} weight="bold" aria-hidden />
            </Link>
            <p className="text-micro text-muted">{copy.site.rights}</p>
          </footer>
        </main>

        <aside
          aria-label={profile.name}
          className="rise order-first py-(--gutter) lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:sticky lg:top-0 lg:h-dvh"
          style={step(1)}
        >
          {/* Corners concentric with the portrait's: its radius plus the sheet's padding. */}
          <div data-dither-floor-narrow className="sheet flex h-full flex-col rounded-[calc(var(--radius-card)+0.625rem)] p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card lg:aspect-auto lg:min-h-0 lg:flex-1">
              <Image
                src="/images/bo-hubbard.jpg"
                alt={copy.landing.portraitAlt}
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 100vw"
                placeholder="blur"
                blurDataURL={blurFor({ type: "image", src: "/images/bo-hubbard.jpg", aspect: "2/3" })}
                className="object-cover object-[50%_28%]"
              />
            </div>

            <div className="flex flex-col gap-2 px-3 pb-3 pt-5">
              <p className="font-display text-heading font-semibold">{profile.name}</p>
              <p className="flex items-center gap-1.5 text-caption text-muted">
                <MapPin size={12} weight="bold" aria-hidden />
                {copy.landing.location}
                <span aria-hidden>·</span>
                {copy.landing.roles}
              </p>
              <p className="text-body text-muted">
                {copy.landing.grad}
                <span className="flex items-center gap-[0.3em]">
                  {copy.landing.craft}
                  <span className="app-icon block size-[1.25em]">
                    <Image src="/images/bubbard-logo.png" alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  {/* The spending page lives on its own subdomain, so the link is absolute. */}
                  <a
                    href="https://spending.bohubbard.xyz"
                    className="font-bold text-ink underline decoration-line underline-offset-4 transition-colors duration-(--dur-fast) hover:decoration-vermilion"
                  >
                    {copy.catalog.brand}
                  </a>
                </span>
              </p>

              <ContactLinks />
            </div>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
