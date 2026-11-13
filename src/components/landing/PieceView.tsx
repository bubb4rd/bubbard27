import Image from "next/image";
import type { CSSProperties } from "react";
import PhoneFrame from "@/components/work/PhoneFrame";
import type { Piece } from "@/content/featured";
import { widgets } from "./widgets";

const tones = {
  ink: "bg-ink text-mat",
  mat: "bg-mat text-ink",
  accent: "bg-vermilion text-white",
} as const;

/**
 * One element of a hover choreography, hidden behind the icon until its
 * feature opens. A mockup with `morph` carries that view-transition name into
 * the case study it opens.
 */
export default function PieceView({ piece, index, morph }: { piece: Piece; index: number; morph?: string }) {
  const place = { "--x": piece.x, "--y": piece.y, "--r": `${piece.r}deg`, "--i": index } as CSSProperties;

  if (piece.kind === "widget") {
    const Widget = widgets[piece.widget];
    // Widgets are sized in em, so their scale follows the choreography unit.
    return (
      <div aria-hidden style={{ ...place, fontSize: "calc(var(--u) * 1.15)" }} className="piece">
        <Widget />
      </div>
    );
  }
  if ("text" in piece) {
    const Icon = piece.icon;
    return (
      <span
        aria-hidden
        style={place}
        className={`piece inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-caption font-medium shadow-[var(--shadow-soft)] ${tones[piece.tone]} ${
          piece.kind === "bubble" ? "rounded-[1rem_1rem_1rem_0.3rem]" : "rounded-full"
        }`}
      >
        {Icon && <Icon size={14} weight="bold" />}
        {piece.text}
      </span>
    );
  }

  const style = {
    ...place,
    "--w": `calc(${piece.w} * var(--u))`,
    ...(piece.tilt && { "--rx": `${piece.tilt[0]}deg`, "--ry": `${piece.tilt[1]}deg` }),
    ...(morph && { "--morph": morph }),
  } as CSSProperties;
  const fade = piece.fade ? { "data-fade": true } : {};
  const named = morph ? { "data-morph": "" } : {};
  const image = <Image src={piece.src} alt="" fill sizes="420px" className="object-cover object-top" />;

  if (piece.kind === "phone") {
    return (
      <div aria-hidden style={style} className="piece [filter:drop-shadow(var(--shadow-drop))]" {...fade} {...named}>
        <PhoneFrame>{image}</PhoneFrame>
      </div>
    );
  }
  if (piece.kind === "screen") {
    return (
      <div aria-hidden style={style} className="piece screen" {...fade} {...named}>
        <div className="relative overflow-hidden rounded-card" style={{ aspectRatio: piece.aspect }}>
          {image}
        </div>
      </div>
    );
  }
  return (
    <div
      aria-hidden
      style={{ ...style, aspectRatio: piece.aspect }}
      className="piece overflow-hidden rounded-card shadow-[var(--shadow-lifted)] ring-1 ring-black/10"
      {...fade}
      {...named}
    >
      {image}
    </div>
  );
}
