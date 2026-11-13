"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import posthog from "posthog-js";
import type { ReactNode } from "react";
import AppIcon from "@/components/AppIcon";
import { copy } from "@/content/copy";
import { artistField, artistPieces, featured, type Feature, type Piece } from "@/content/featured";
import { contact } from "@/data/contact";
import { projects } from "@/data/projects";
import { logPortfolioInteraction } from "@/lib/posthogLogger";
import PieceView from "./PieceView";

const iconSize = "clamp(4.5rem, 6.4vw, 6rem)";

// Literal class names, so Tailwind sees them.
const faces: Record<Feature["font"], string> = {
  elovate: "font-elovate font-normal tracking-[-0.03em]",
  wkcc: "font-wkcc font-extrabold tracking-[-0.02em]",
  vaultair: "font-vaultair font-semibold tracking-[-0.03em]",
};

/**
 * The featured row: three projects and the portrait. Hovering or focusing
 * one blurs the page, springs that project's mockups and live widgets out
 * from behind its icon, swaps its label for a title in the project's own
 * face, a tagline and a button, and turns the dot field behind into the
 * project's own (data-field, read by Backdrop). Opening a project carries
 * its mockups into the case study's stage (see "Landing to case" in
 * globals.css).
 */
export default function Featured() {
  return (
    <ul className="grid grid-cols-2 gap-x-[clamp(2.5rem,7vw,7rem)] gap-y-14 sm:grid-cols-4">
      {featured.map((f) => {
        const project = projects.find((p) => p.id === f.id);
        if (!project) throw new Error(`Featured project "${f.id}" is not in data/projects.`);
        return (
          <Item
            key={f.id}
            href={`/work/${f.id}`}
            morphId={f.id}
            field={f.field}
            icon={<AppIcon src={project.icon} alt={`${project.title} icon`} size={iconSize} morphId={project.id} priority />}
            pieces={f.pieces}
            label={f.label}
            title={
              <span className={faces[f.font]}>
                {f.title.map((part) => (
                  <span
                    key={part.text}
                    className={part.fill ? "mr-[0.06em] rounded-[0.14em] px-[0.1em] pb-[0.04em]" : undefined}
                    style={{ color: part.color, backgroundColor: part.fill }}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            }
            tagline={f.tagline}
            cta={f.cta}
          />
        );
      })}
      <Item
        href={`mailto:${contact.email}`}
        field={artistField}
        icon={<AppIcon src="/images/bo-hubbard.jpg" alt={copy.artist.alt} size={iconSize} priority />}
        pieces={artistPieces}
        label={copy.artist.label}
        title={<span className="font-display font-semibold tracking-[-0.03em]">{copy.artist.title}</span>}
        tagline={copy.artist.tagline}
        cta={copy.artist.cta}
      />
    </ul>
  );
}

type ItemProps = {
  href: string;
  /** Project id: names the mockups so they morph into the case study's stage. */
  morphId?: string;
  field: Feature["field"];
  icon: ReactNode;
  pieces: Piece[];
  label: string;
  title: ReactNode;
  tagline: string;
  cta: string;
};

const isMockup = (piece: Piece) => piece.kind === "card" || piece.kind === "phone" || piece.kind === "screen";

function Item({ href, morphId, field, icon, pieces, label, title, tagline, cta }: ItemProps) {
  const body = (
    <>
      <span className="relative isolate">
        {pieces.map((piece, i) => (
          <PieceView
            key={i}
            piece={piece}
            index={i}
            morph={morphId && isMockup(piece) ? `landing-${morphId}-${pieces.slice(0, i).filter(isMockup).length}` : undefined}
          />
        ))}
        <span className="feature-icon block">{icon}</span>
      </span>

      {/* Fixed-height slot: the label and the detail swap in place without moving the icon. */}
      <span className="relative mt-4 block h-9 w-full">
        <span className="feature-label pill pill-soft absolute left-1/2 top-0 -translate-x-1/2">{label}</span>
        <span className="feature-detail absolute left-1/2 top-0 flex w-80 -translate-x-1/2 flex-col items-center text-center">
          <span className="text-feature">{title}</span>
          <span className="mt-3 max-w-[26ch] text-lead text-ink/85">{tagline}</span>
          <span className="pill pill-soft mt-5">
            {cta}
            <ArrowUpRight size={14} weight="bold" aria-hidden />
          </span>
        </span>
      </span>
    </>
  );

  const className = "feature relative flex flex-col items-center";
  return (
    <li data-recede className="flex justify-center">
      {href.startsWith("/") ? (
        <Link href={href} prefetch transitionTypes={["nav-forward", "from-landing"]} data-field={field} className={className}>
          {body}
        </Link>
      ) : (
        <a
          href={href}
          data-field={field}
          onClick={() => {
            posthog.capture("contact_initiated");
            logPortfolioInteraction("contact initiation selected", { surface: "featured" });
          }}
          className={className}
        >
          {body}
        </a>
      )}
    </li>
  );
}
