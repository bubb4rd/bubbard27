import Image from "next/image";
import { ViewTransition } from "react";

type Props = {
  src: string;
  alt: string;
  /** CSS length for width and height. */
  size: string;
  /** Pairs this icon with the same project's icon on another page, so navigation morphs one into the other. */
  morphId?: string;
  priority?: boolean;
  className?: string;
};

/** A project's app icon as a squircle. */
export default function AppIcon({ src, alt, size, morphId, priority, className = "" }: Props) {
  const icon = (
    <span
      className={`app-icon block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes="160px" priority={priority} className="object-cover object-top" />
    </span>
  );
  if (!morphId) return icon;
  return (
    <ViewTransition name={`icon-${morphId}`} share="morph" default="none">
      {icon}
    </ViewTransition>
  );
}
