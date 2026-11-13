import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { copy } from "@/content/copy";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-(--gutter) text-center">
      <h1 className="rise font-display text-title font-semibold">{copy.notFound.title}</h1>
      <p className="rise mt-3 max-w-[40ch] text-body text-muted">{copy.notFound.body}</p>
      <Link href="/work" transitionTypes={["nav-back"]} className="pill pill-solid rise mt-6">
        <ArrowLeft size={14} weight="bold" aria-hidden />
        {copy.notFound.back}
      </Link>
    </main>
  );
}
