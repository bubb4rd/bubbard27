"use client";

import { EnvelopeSimple, FileText } from "@phosphor-icons/react/dist/ssr";
import posthog from "posthog-js";
import type { CSSProperties } from "react";
import { BrandMark, brandLogos } from "@/components/BrandIcon";
import { copy } from "@/content/copy";
import { contact } from "@/data/contact";
import { logPortfolioInteraction } from "@/lib/posthogLogger";

/** Every way to reach Bo, under the portrait: email, the CV, then a brand-coloured circle per profile. */
export default function ContactLinks() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <a
        href={`mailto:${contact.email}`}
        onClick={() => {
          posthog.capture("contact_initiated");
          logPortfolioInteraction("contact initiation selected", { surface: "portrait" });
        }}
        className="pill pill-solid"
      >
        <EnvelopeSimple size={14} weight="bold" aria-hidden />
        {copy.landing.hello}
      </a>
      <a
        href="/cv.pdf"
        download={copy.site.cvFile}
        onClick={() => {
          posthog.capture("cv_downloaded");
          logPortfolioInteraction("cv download selected", { asset: "cv" });
        }}
        className="pill pill-soft"
      >
        <FileText size={14} weight="bold" aria-hidden />
        {copy.site.cv}
      </a>
      <ul className="flex items-center gap-1.5">
        {contact.links.map(({ label, href }) => {
          const logo = brandLogos[label];
          if (!logo) return null;
          return (
            <li key={label}>
              {/* p matches the pill's block padding, so the circle is exactly a pill's height. */}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                onClick={() => {
                  posthog.capture("outbound_profile_link_clicked", { destination: label });
                  logPortfolioInteraction("outbound profile link selected", { destination: label });
                }}
                className="pill bg-(--brand) p-[0.6rem] hover:bg-[color-mix(in_srgb,var(--brand),white_18%)]"
                style={{ "--brand": logo.bg } as CSSProperties}
              >
                <BrandMark logo={logo} size="14px" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
