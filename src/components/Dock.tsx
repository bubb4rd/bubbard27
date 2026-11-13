"use client";

import { DotsThree, FileText } from "@phosphor-icons/react/dist/ssr";
import posthog from "posthog-js";
import { useEffect, useRef, type PointerEvent } from "react";
import { copy } from "@/content/copy";
import { contact } from "@/data/contact";
import { logPortfolioInteraction } from "@/lib/posthogLogger";

/** Brand marks (Simple Icons, CC0), white on each brand's colour, sized to sit in the squircle like the real app icons. */
const logos: Record<string, { bg: string; scale: string; d: string }> = {
  GitHub: {
    bg: "#181717",
    scale: "62%",
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  Behance: {
    bg: "#1769ff",
    scale: "66%",
    d: "M0 4.4804V19.243h7.1554c.6613 0 1.3078-.0832 1.9297-.248.6288-.1654 1.1905-.4203 1.6792-.7661.485-.3431.8784-.788 1.1677-1.3369.2862-.542.4294-1.187.4294-1.9354 0-.9232-.219-1.7109-.6675-2.369-.446-.6542-1.1187-1.1139-2.0274-1.3746.6674-.3161 1.1658-.7227 1.506-1.2177.3371-.4967.5058-1.1174.5058-1.8607 0-.6873-.1127-1.2677-.3375-1.7318-.2306-.4709-.552-.8452-.9632-1.1266-.4176-.2808-.912-.4857-1.4912-.6085-.5827-.1261-1.22-.1872-1.9264-.1872zm15.6674.9903v1.4567h5.9844V5.4707zM3.2509 6.9947h3.0407c.2873 0 .5683.0204.8359.0731.2728.0466.508.134.716.2595.2096.1205.3754.293.501.5132.1208.2203.1806.5038.1806.8474 0 .6189-.1811 1.0702-.5551 1.3426-.3778.2775-.8543.4147-1.4304.4147H3.2509zm15.545 1.2564c-.819 0-1.5587.1462-2.2294.436-.6705.2904-1.2463.6875-1.7318 1.1915-.4846.5011-.8535 1.0986-1.12 1.7909-.2612.69-.3942 1.4366-.3942 2.236 0 .8268.1284 1.5891.3835 2.2786.258.6923.6198 1.2822 1.0856 1.781.478.4967 1.046.8784 1.726 1.1497.6806.269 1.4382.4048 2.2803.4048 1.208 0 2.2446-.2771 3.0949-.8326.8599-.5528 1.4902-1.471 1.9058-2.7574h-2.585c-.1.3307-.359.649-.784.9467-.4295.2988-.9417.4492-1.534.4492-.8233 0-1.4588-.2168-1.8985-.6462-.4412-.4294-.7267-1.2289-.7267-2.0742h7.713c.0552-.8291-.0122-1.6218-.2045-2.3797-.1938-.7601-.5033-1.4365-.9393-2.029-.4355-.5931-.9904-1.0667-1.667-1.4165-.6788-.3543-1.4703-.5288-2.3747-.5288zm-.0887 2.217c.7209 0 1.3126.2092 1.6612.5954.3503.389.6065.9432.6766 1.6915h-4.7766c.0136-.2085.058-.4444.1339-.7045.0749-.2668.2039-.5164.3933-.753.1905-.2326.4402-.431.744-.5896.3109-.1608.6986-.2397 1.1676-.2397zM3.251 12.664h3.5334c.6996 0 1.2682.1602 1.6948.4836.4259.328.6405.8685.6405 1.6292 0 .3885-.0632.7094-.1946.9566-.131.2495-.3106.4466-.528.5896-.2172.1491-.4753.2498-.7661.3137-.2862.0639-.5905.092-.9115.092H3.2509z",
  },
  // The "in" alone: the squircle is the logo's rounded square.
  LinkedIn: {
    bg: "#0a66c2",
    scale: "100%",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z",
  },
};

const tile =
  "flex w-20 flex-col items-center gap-2 rounded-[calc(var(--radius-panel)-0.5rem)] px-2 py-3 text-caption transition-colors duration-(--dur-fast) hover:bg-wall";
const icon = "app-icon grid size-12 place-items-center";

/** Grace period so the pointer can cross gaps without the dock snapping shut. */
const closeDelay = 200;

/**
 * A dots pill that springs open into the profile links and CV. Native
 * popover, so a click or tap toggles it and it light-dismisses without JS;
 * a mouse hovering the pill (or the open dock) also opens it.
 */
export default function Dock() {
  const dock = useRef<HTMLDivElement>(null);
  const closing = useRef<number>(undefined);

  useEffect(() => () => clearTimeout(closing.current), []);

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closing.current);
    if (!dock.current?.matches(":popover-open")) dock.current?.showPopover();
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closing.current);
    closing.current = window.setTimeout(() => {
      if (dock.current?.matches(":popover-open")) dock.current.hidePopover();
    }, closeDelay);
  };

  return (
    // The dock is a DOM child, so hovering it keeps the pointer "inside" even though it renders in the top layer.
    <div className="flex" onPointerEnter={enter} onPointerLeave={leave}>
      <button type="button" popoverTarget="dock" aria-label={copy.dock.open} className="pill pill-soft px-3.5">
        <DotsThree size={18} weight="bold" aria-hidden />
      </button>

      <div ref={dock} id="dock" popover="auto" className="dock rounded-[2rem] border border-line bg-mat p-2 shadow-[var(--shadow-lifted)]">
        <ul className="flex gap-1">
          {contact.links.map(({ label, href }) => {
            const logo = logos[label];
            return (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    posthog.capture("outbound_profile_link_clicked", { destination: label });
                    logPortfolioInteraction("outbound profile link selected", { destination: label });
                  }}
                  className={tile}
                >
                  {logo && (
                    <span className={icon} style={{ backgroundColor: logo.bg }} aria-hidden>
                      <svg viewBox="0 0 24 24" fill="#fff" style={{ width: logo.scale, height: logo.scale }}>
                        <path d={logo.d} />
                      </svg>
                    </span>
                  )}
                  {label}
                </a>
              </li>
            );
          })}
          <li>
            <a
              href="/cv.pdf"
              download={copy.dock.cvFile}
              onClick={() => {
                posthog.capture("cv_downloaded");
                logPortfolioInteraction("cv download selected", { asset: "cv" });
              }}
              className={tile}
            >
              <span className={icon} aria-hidden>
                <FileText size={24} />
              </span>
              {copy.dock.cv}
            </a>
          </li>
        </ul>
        <p className="mt-1 pb-1 text-center text-micro text-muted">{copy.dock.rights}</p>
      </div>
    </div>
  );
}
