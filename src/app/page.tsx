import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Dock from "@/components/Dock";
import Backdrop from "@/components/landing/Backdrop";
import Featured from "@/components/landing/Featured";
import PageTransition from "@/components/PageTransition";
import { copy } from "@/content/copy";
import { projects } from "@/data/projects";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * One screen: the BUBBARD lockup, three featured projects and the artist, a
 * line of bio, the way to everything else. Spare height on a tall screen
 * splits evenly above the lockup and above the nav, so the group sits
 * mid-screen and the hover pieces keep clear of the top edge.
 */
export default function Home() {
  return (
    <PageTransition>
      <main className="flex min-h-dvh flex-col items-center px-(--gutter) pt-[clamp(4rem,15svh,9rem)]">
        <Backdrop />
        <h1 data-recede className="rise mt-auto flex items-center gap-3" style={step(0)}>
          <span className="app-icon block size-10">
            <Image src="/images/bubbard-logo.png" alt="" fill sizes="80px" priority className="object-cover" />
          </span>
          <span className="wordmark text-heading">{copy.landing.brand}</span>
        </h1>

        <div className="rise mt-[clamp(6rem,22svh,13rem)]" style={step(1)}>
          <Featured />
        </div>

        <p data-recede className="rise mt-[clamp(4rem,10svh,6.5rem)] max-w-[42ch] text-center text-body text-muted" style={step(2)}>
          {copy.landing.bio}
        </p>

        <nav data-recede className="rise mt-auto flex items-center gap-2 pb-(--gutter) pt-12" style={step(3)}>
          <Link href="/work" transitionTypes={["nav-forward"]} className="pill pill-solid">
            {copy.landing.allWork}
            <span className="text-mat/60">{projects.length}</span>
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
          <Dock />
        </nav>
      </main>
    </PageTransition>
  );
}
