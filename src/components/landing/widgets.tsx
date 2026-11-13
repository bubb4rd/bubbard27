import { CheckCircle, Copy, Cursor, Fingerprint, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

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

/** WKCC Perks: the push every member gets when a deal goes live. */
function WkccNotification() {
  return (
    <div className={`flex w-[21em] items-start gap-[0.7em] rounded-[1.3em] bg-white/90 p-[0.8em] ring-1 ring-black/5 backdrop-blur-xl ${lifted}`}>
      <span className="relative block size-[2.5em] shrink-0 overflow-hidden rounded-[0.6em]">
        <Image src="/images/wkcc-favicon.png" alt="" fill sizes="48px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1 text-[0.9em] leading-snug text-black">
        <div className="flex justify-between text-[0.8em] text-black/45">
          <span className="font-semibold uppercase tracking-[0.06em]">WKCC Perks</span>
          <span>now</span>
        </div>
        <p className="font-semibold">New perk from Hubba-Hubba</p>
        <p className="text-black/65">Get ready for Winter BOGO</p>
      </div>
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

/** Vaultair: unlocking with Windows Hello. */
function VaultHello() {
  return (
    <div className={`flex w-[17em] items-center gap-[0.8em] rounded-[0.8em] bg-[#1b1c1f] p-[0.8em] text-white ring-1 ring-white/10 ${lifted}`}>
      <span className="grid size-[2.5em] shrink-0 place-items-center rounded-[0.6em] bg-[#2563EB]/20 text-[#60A5FA]">
        <Fingerprint size="1.5em" />
      </span>
      <div className="leading-snug">
        <p className="text-[0.95em] font-semibold">Windows Hello</p>
        <p className="text-[0.78em] text-white/55">Vault unlocked on this PC</p>
      </div>
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

/** Bo: the portrait selected on a design canvas, with its frame size. */
function BoFrame() {
  return (
    <div className="relative w-[15em]">
      <span className={`relative block aspect-[4/5] overflow-hidden rounded-[0.4em] ${lifted}`}>
        <Image src="/images/bo-hubbard.jpg" alt="" fill sizes="240px" className="object-cover object-top" />
      </span>
      <span className="absolute -inset-[0.35em] ring-[1.5px] ring-vermilion" />
      {["-left-[0.7em] -top-[0.7em]", "-right-[0.7em] -top-[0.7em]", "-bottom-[0.7em] -left-[0.7em]", "-bottom-[0.7em] -right-[0.7em]"].map((at) => (
        <span key={at} className={`absolute size-[0.7em] border-[1.5px] border-vermilion bg-white ${at}`} />
      ))}
      <span className="absolute left-1/2 top-full mt-[0.8em] -translate-x-1/2 rounded-[0.3em] bg-vermilion px-[0.45em] py-[0.15em] font-mono text-[0.68em] text-white">
        1080 × 1350
      </span>
    </div>
  );
}

/** Bo: a named multiplayer cursor. */
function BoCursor() {
  return (
    <div className="flex items-start">
      <Cursor weight="fill" size="1.7em" className="text-vermilion drop-shadow-sm" />
      <span className="-ml-[0.2em] mt-[1.2em] rounded-[0.35em_0.9em_0.9em_0.9em] bg-vermilion px-[0.65em] py-[0.25em] text-[0.85em] font-semibold text-white">
        Bo
      </span>
    </div>
  );
}

export const widgets = { EloLive, WkccNotification, WkccCheckout, VaultHello, VaultSecret, BoFrame, BoCursor };
export type WidgetName = keyof typeof widgets;
