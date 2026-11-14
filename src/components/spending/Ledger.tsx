"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState, type CSSProperties, type PointerEvent } from "react";
import { copy } from "@/content/copy";
import { monthly, services, spending, usd, type Group, type Mark, type Service } from "@/data/spending";

/** Biggest first, so the darkest strip segment leads. */
const byCost = (a: Service, b: Service) => monthly(b) - monthly(a);
const ranked = [...services].sort(byCost);

type Period = Service["cycle"];
const periods: Period[] = ["monthly", "yearly"];
const per = (p: Period) => (p === "yearly" ? copy.spending.perYear : copy.spending.perMonth);
/** What a service costs over a period: its billed price when that's how it's billed, else scaled by twelve. */
const over = (s: Service, p: Period) => (s.cycle === p ? s.price : p === "yearly" ? s.price * 12 : s.price / 12);
/** A service's share of the total shown; the same in either period. */
const share = (s: Service, total: number, p: Period) => {
  const pct = (over(s, p) / total) * 100;
  return pct < 0.5 ? "<1%" : `${Math.round(pct)}%`;
};
const step = (i: number) => ({ "--i": i }) as CSSProperties;
const groupOf = new Map<string, Group>(spending.groups.flatMap((g) => g.services.map((s) => [s.id, g])));

/**
 * Everything that answers to the category filter: the monthly and yearly
 * totals, the strip (each service's share), the filters, and the services as
 * one flat list, most expensive per month first. A filter recomputes the
 * totals and shares for that category and collapses the strip's other
 * segments, so the rest grow to fill it.
 * Pointing at a row or a segment lights its partner in vermilion and lets
 * the rest fall back; keyboard focus on a row does the same. Each category
 * has an icon: on its filter pill, and beside each service's name under All,
 * so the flat list still says where everything belongs.
 */
export default function Ledger() {
  const [active, setActive] = useState<string>();
  // A group title, or undefined for all.
  const [filter, setFilter] = useState<string>();
  // Which period every price on the page is shown in.
  const [period, setPeriod] = useState<Period>("monthly");

  // Most expensive per month first (yearly plans by their monthly twelfth); ties keep their order in the data.
  const shown = [...(spending.groups.find((g) => g.title === filter)?.services ?? services)].sort(byCost);
  const total = shown.reduce((sum, s) => sum + over(s, period), 0);
  // Shade rank within what's shown, so the biggest shown segment is always the darkest.
  const rank = new Map(shown.map((s, i) => [s.id, i]));

  // Mouse only, so a tap doesn't leave a row stuck lit.
  const hover = (id?: string) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(id);
  };

  const filters: { label: string; value?: string; icon?: Group["icon"] }[] = [
    { label: copy.spending.all },
    ...spending.groups.map((g) => ({ label: g.title, value: g.title, icon: g.icon })),
  ];

  return (
    <div className="ledger" data-active={active ? "" : undefined}>
      {/* Keyed by filter and period, so new figures rise in rather than swapping in place. */}
      <section key={`${filter}-${period}`} className="mt-[clamp(4rem,14svh,8rem)]" aria-live="polite">
        <h1 className="rise font-display text-display font-semibold tabular-nums" style={step(1)}>
          <span className="sr-only">{copy.spending.totalLabel(period, filter)} </span>
          {usd(total)}
          <span className="text-title font-medium text-muted">{per(period)}</span>
        </h1>
        <p className="rise mt-5 text-lead" style={step(2)}>
          {/* The other period, so both totals are always in view. */}
          {period === "monthly"
            ? copy.spending.summary(usd(total * 12), "year", shown.length)
            : copy.spending.summary(usd(total / 12), "month", shown.length)}
        </p>
      </section>
      <p className="rise mt-2 max-w-[48ch] text-body text-muted" style={step(2)}>
        {copy.spending.intro}
      </p>

      <div className="rise mt-12" style={step(3)}>
        <div aria-hidden className="flex h-2.5 gap-[3px]" style={{ "--n": shown.length } as CSSProperties}>
          {ranked.map((s) => {
            const i = rank.get(s.id);
            const inView = i !== undefined;
            return (
              <span
                key={s.id}
                title={inView ? `${s.name} · ${share(s, total, period)}` : undefined}
                data-on={active === s.id ? "" : undefined}
                data-out={inView ? undefined : ""}
                onPointerEnter={inView ? hover(s.id) : undefined}
                onPointerLeave={inView ? hover() : undefined}
                className="strip-seg"
                style={{ flexGrow: inView ? monthly(s) : 0, "--i": i ?? 0 } as CSSProperties}
              />
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={copy.spending.filter} className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`pill ${filter === f.value ? "bg-ink text-mat" : "pill-soft"}`}
              >
                {/* Filled while its filter is on, outlined otherwise. */}
                {f.icon && <f.icon size={14} weight={filter === f.value ? "fill" : "regular"} aria-hidden />}
                {f.label}
              </button>
            ))}
          </div>

          {/* A segmented switch rather than more pills, so it doesn't read as another category. */}
          <div role="group" aria-label={copy.spending.period} className="flex rounded-full bg-ink/6 p-1">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={`pill px-3 py-1.5 ${period === p ? "bg-mat text-ink shadow-(--shadow-soft)" : "text-muted hover:text-ink"}`}
              >
                {copy.spending.periods[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet mt-4 px-(--pad) py-[calc(var(--pad)*0.5)]">
          {/* Keyed by filter, so a new selection rises in rather than swapping in place. */}
          <ul key={filter ?? ""} className="divide-y divide-line">
            {shown.map((s, i) => (
              <li key={s.id} className="rise" style={{ "--i": Math.min(i, 8) } as CSSProperties}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-on={active === s.id ? "" : undefined}
                  onPointerEnter={hover(s.id)}
                  onPointerLeave={hover()}
                  onFocus={() => setActive(s.id)}
                  onBlur={() => setActive(undefined)}
                  className="ledger-row grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 py-3.5"
                >
                  <MarkView mark={s.mark} />
                  <span className="min-w-0">
                    <span className="block text-body font-medium">
                      {s.name}
                      {!filter && <CategoryIcon group={groupOf.get(s.id)!} />}
                      <ArrowUpRight size={12} weight="bold" aria-hidden className="ledger-arrow ml-1.5 inline text-muted" />
                    </span>
                    {s.use && <span className="block text-caption text-muted">{s.use}</span>}
                  </span>
                  <span className="text-right tabular-nums">
                    <span className="block text-body font-medium">
                      {s.approx && <span className="font-normal text-muted">{copy.spending.about} </span>}
                      {usd(over(s, period))}
                      <span className="font-normal text-muted">{per(period)}</span>
                    </span>
                    <span className="block text-caption text-muted">
                      {/* The billed price, when the chosen period isn't how it's billed. */}
                      {s.cycle !== period && `${usd(s.price)}${per(s.cycle)} · `}
                      <span className="sr-only">{copy.spending.share} </span>
                      {share(s, total, period)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** A service's category as its icon alone; the name is a tooltip and read by screen readers. */
function CategoryIcon({ group: { title, icon: Glyph } }: { group: Group }) {
  return (
    <span title={title} className="ml-1.5 inline-flex align-[-2px] text-muted">
      <Glyph size={14} weight="fill" aria-hidden />
      <span className="sr-only">{title}</span>
    </span>
  );
}

/** A brand logo on its colour, or a logo image, in the site's squircle. */
function MarkView({ mark }: { mark: Mark }) {
  if ("image" in mark)
    return (
      <span className="app-icon block size-10 shrink-0" aria-hidden>
        <Image src={mark.image} alt="" fill sizes="80px" className="object-cover" />
      </span>
    );
  return (
    <span className="app-icon grid size-10 shrink-0 place-items-center" style={{ backgroundColor: mark.bg }} aria-hidden>
      <svg viewBox="0 0 24 24" fill={mark.fg} style={{ width: mark.scale, height: mark.scale }}>
        <path d={mark.logo} />
      </svg>
    </span>
  );
}
