import Image from "next/image";
import type { CSSProperties } from "react";
import PhoneFrame from "@/components/work/PhoneFrame";
import type { Piece } from "@/content/featured";
import { widgets } from "./widgets";

/**
 * One element of a hover choreography, hidden in its card's cover until the
 * card opens. A mockup with `morph` carries that view-transition name into
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

const isMockup = (piece: Piece) => piece.kind === "card" || piece.kind === "phone" || piece.kind === "screen";

/**
 * A feature's whole choreography. With a project id, each mockup is named
 * landing-<id>-<n> (n counts mockups only), matching the case study stage's
 * overview slots, so a from-landing navigation flies it into place.
 */
export function Pieces({ pieces, morphId }: { pieces: Piece[]; morphId?: string }) {
  return pieces.map((piece, i) => (
    <PieceView
      key={i}
      piece={piece}
      index={i}
      morph={morphId && isMockup(piece) ? `landing-${morphId}-${pieces.slice(0, i).filter(isMockup).length}` : undefined}
    />
  ));
}
