import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import Ledger from "@/components/spending/Ledger";
import { copy } from "@/content/copy";
import { spending } from "@/data/spending";

export const metadata: Metadata = {
  title: copy.spending.title,
  description: copy.spending.description,
  alternates: { canonical: "https://spending.bohubbard.xyz" },
};

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const updated = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(spending.updated));

/**
 * spending.bohubbard.xyz (next.config rewrites that host's root here): the
 * header, then the Ledger, which owns everything the category filter
 * changes (totals, strip, list). Lives on a subdomain, so links home are
 * absolute.
 */
export default function Spending() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[46rem] flex-col px-(--gutter) pt-(--gutter)">
      <header className="rise flex items-center justify-between gap-4" style={step(0)}>
        <a href="https://bohubbard.xyz" className="flex items-center gap-2.5">
          <span className="app-icon block size-8">
            <Image src="/images/bubbard-logo.png" alt="" fill sizes="64px" priority className="object-cover" />
          </span>
          <span className="wordmark text-caption">{copy.landing.brand}</span>
        </a>
        <p className="text-caption text-muted">
          {copy.spending.updated} <time dateTime={spending.updated}>{updated}</time>
        </p>
      </header>

      <Ledger />

      <footer className="mt-auto pb-(--gutter) pt-12 text-caption text-muted">{copy.spending.note}</footer>
    </main>
  );
}
