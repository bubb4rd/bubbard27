import type { Feature } from "@/content/featured";

// Literal class names, so Tailwind sees them.
const faces: Record<Feature["font"], string> = {
  elovate: "font-elovate font-normal tracking-[-0.03em]",
  wkcc: "font-wkcc font-extrabold tracking-[-0.02em]",
  vaultair: "font-vaultair font-semibold tracking-[-0.03em]",
  gliide: "font-gliide font-normal tracking-[-0.01em]",
};

/** A featured project's name set in its own face and colours; sized by the parent. */
export default function FeatureTitle({ feature }: { feature: Feature }) {
  return (
    <span className={faces[feature.font]}>
      {feature.title.map((part) => (
        <span
          key={part.text}
          className={part.fill ? "mr-[0.06em] rounded-[0.14em] px-[0.1em] pb-[0.04em]" : undefined}
          style={{ color: part.color, backgroundColor: part.fill }}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}
