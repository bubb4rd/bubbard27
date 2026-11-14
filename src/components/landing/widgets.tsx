import { CheckCircle, Copy, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

/*
 * Small live-interface mocks that float around a featured project on hover,
 * each drawn in that product's own colours and taken from its real UI (the
 * numbers come from the screenshots in data/projects). Sized in em, and the
 * piece sets font-size from --u, so they scale with the choreography.
 */

const lifted = "shadow-[var(--shadow-lifted)]";

/** Elovate: the live Top 250 cutoff tile. */
function EloLive() {
  return (
    <div className={`w-[15em] rounded-[0.9em] bg-[#0d0d0d] p-[0.9em] font-mono text-white ring-1 ring-white/10 ${lifted}`}>
      <div className="flex items-center justify-between text-[0.68em] uppercase tracking-[0.12em] text-white/55">
        <span className="flex items-center gap-[0.5em]">
          <span className="size-[0.55em] rounded-full bg-[#EAB308]" />
          Live, Warzone
        </span>
        <span>Top 250</span>
      </div>
      <div className="mt-[0.45em] flex items-baseline gap-[0.5em]">
        <span className="text-[2em] font-bold leading-none text-[#F5C518]">13,281</span>
        <span className="text-[0.72em] text-white/60">cutoff SR</span>
      </div>
      <div className="mt-[0.4em] text-[0.72em] text-[#4ADE80]">+208 in the final 24h</div>
    </div>
  );
}

/** WKCC Perks: the redeem screen's call to action. */
function WkccCheckout() {
  return (
    <div className={`flex items-center gap-[0.45em] whitespace-nowrap rounded-full bg-[#7AC143] py-[0.35em] pl-[0.4em] pr-[1.1em] font-semibold text-white ${lifted}`}>
      <CheckCircle weight="fill" size="1.65em" className="shrink-0" />
      Show at checkout
    </div>
  );
}

/** Vaultair: a stored secret that never reaches the UI, with its status as icon plus text. */
function VaultSecret() {
  return (
    <div className={`w-[18em] rounded-[0.8em] bg-[#121316] p-[0.9em] text-white ring-1 ring-white/10 ${lifted}`}>
      <div className="flex items-center justify-between text-[0.75em] text-white/55">
        <span>Steam, Main</span>
        <span className="flex items-center gap-[0.3em] text-[#4ADE80]">
          <ShieldCheck weight="fill" size="1.15em" />
          Secure
        </span>
      </div>
      <div className="mt-[0.55em] flex items-center justify-between rounded-[0.5em] bg-white/6 px-[0.75em] py-[0.6em]">
        <span className="font-mono tracking-[0.25em]">••••••••••</span>
        <Copy size="1.1em" className="text-white/60" />
      </div>
      <p className="mt-[0.5em] text-[0.7em] text-white/40">Clipboard clears in 30s</p>
    </div>
  );
}

// Gliide's Paper & Ink tokens (design/tokens.css in its repo): ink steps, hairline, sunken well, gain green.
const gliide = {
  ink: "text-[oklch(0.22_0.008_85)]",
  ink3: "text-[oklch(0.53_0.009_85)]",
  card: "rounded-[0.75em] bg-white ring-1 ring-[oklch(0.22_0.008_85/0.08)]",
  well: "bg-[oklch(0.97_0.004_95)]",
  graphite: "bg-[oklch(0.44_0.009_85)]",
  gain: "bg-[oklch(0.52_0.13_150)]",
  gainText: "text-[oklch(0.48_0.13_150)]",
};

/** Gliide: a tailored fit score, the posting's before and after, from the tailor screen. */
function GliideFit() {
  return (
    <div className={`w-[17em] p-[0.9em] ${gliide.card} ${gliide.ink} ${lifted}`}>
      <p className={`text-[0.72em] ${gliide.ink3}`}>OneImaging · Full Stack Associate</p>
      <div className="mt-[0.35em] flex items-baseline gap-[0.4em] font-gliide tabular-nums">
        <span className={`text-[1.3em] ${gliide.ink3}`}>
          69<span className="text-[0.6em]">%</span>
        </span>
        <span className={gliide.ink3}>›</span>
        <span className="text-[2.4em] leading-none">
          88<span className="text-[0.45em]">%</span>
        </span>
      </div>
      <div className={`mt-[0.6em] flex h-[0.3em] overflow-hidden rounded-full ${gliide.well}`}>
        <span className={`w-[69%] ${gliide.graphite}`} />
        <span className={`ml-[0.15em] w-[19%] rounded-full ${gliide.gain}`} />
      </div>
      <p className="mt-[0.55em] whitespace-nowrap text-[0.72em]">
        <span className={`font-medium ${gliide.gainText}`}>+19 points</span>
        <span className={gliide.ink3}> from 4 changes · fits on 1 page</span>
      </p>
    </div>
  );
}

/** Gliide: a posting from the daily job feed, its fit now and once tailored. */
function GliideFeed() {
  return (
    <div className={`flex w-[21em] items-center gap-[0.7em] p-[0.75em] ${gliide.card} ${gliide.ink} ${lifted}`}>
      <span className="grid size-[2.2em] shrink-0 place-items-center rounded-[0.5em] bg-[#1f3a5f] font-semibold text-white">N</span>
      <div className="min-w-0 flex-1 leading-snug">
        <p className="truncate text-[0.88em] font-medium">Junior Software Engineer</p>
        <p className={`truncate text-[0.72em] ${gliide.ink3}`}>Northwind Media · Remote</p>
      </div>
      <div className="shrink-0 text-right tabular-nums">
        <p className="text-[0.85em]">
          <span className={gliide.ink3}>64 › </span>
          <span className="font-semibold">91</span>
        </p>
        <div className={`mt-[0.3em] flex h-[0.25em] w-[4.5em] overflow-hidden rounded-full ${gliide.well}`}>
          <span className={`w-[64%] ${gliide.graphite}`} />
          <span className={`w-[27%] ${gliide.gain}`} />
        </div>
      </div>
    </div>
  );
}

export const widgets = { EloLive, WkccCheckout, VaultSecret, GliideFit, GliideFeed };
export type WidgetName = keyof typeof widgets;
