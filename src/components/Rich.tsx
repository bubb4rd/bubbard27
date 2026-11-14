import { Fragment } from "react";
import type { RichText } from "@/data/projects";

/** Paragraph text whose `href` pieces open as outbound links. */
export default function Rich({ body }: { body: string | Readonly<RichText> }) {
  if (typeof body === "string") return body;
  return body.map((piece, i) =>
    typeof piece === "string" ? (
      <Fragment key={i}>{piece}</Fragment>
    ) : (
      <a
        key={i}
        href={piece.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink underline decoration-line underline-offset-4 transition-colors duration-(--dur-fast) hover:decoration-vermilion"
      >
        {piece.text}
      </a>
    ),
  );
}
