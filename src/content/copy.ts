import { profile } from "@/data/profile";

/**
 * Every interface string on the site. Project write-ups live in data/projects
 * and the featured hovers in content/featured; this file is the voice around
 * them: short, plain sentences, no hype words.
 */
export const copy = {
  meta: {
    title: "BUBBARD",
    description:
      "BUBBARD is the studio of Bo Hubbard, a developer and designer building web, iOS and desktop apps and the brands around them.",
  },
  landing: {
    brand: "BUBBARD",
    bio: "Developer and designer in Chicago. I build desktop, web, and mobile, and the brands around them.",
    allWork: "All work",
    open: "View case",
  },
  artist: {
    label: "Work with me",
    title: profile.name,
    tagline: "Computer Science grad, C/O 2026. Engineering, design, craft, BUBBARD.",
    cta: "Say hello",
    alt: `${profile.name} in a graduation cap and gown`,
  },
  dock: {
    open: "Links",
    cv: "CV",
    cvFile: "Bo-Hubbard-CV.pdf",
    rights: "© 2027 BUBBARD",
  },
  catalog: {
    title: "Work",
    /** Read as one line, with the BUBBARD logo set inline before the brand. */
    role: "Engineering, design,",
    brand: "BUBBARD.",
    intro:
      "Please excuse my terrible writing, there is a reason why I'm in software engineering. Here is some of the processes I've went through and the results of the work I've put in.",
    nav: { home: "Home", work: "Work", cv: "CV" },
    upcoming: "In progress",
    comingSoon: "Coming soon",
    /** Accessible name of the project index under the intro. */
    index: "Projects",
  },
  work: {
    close: "Close",
    overview: "Overview",
    sourceLink: "View source",
    liveLink: "Visit project",
    next: "Next project",
    play: "Play",
    pause: "Pause",
  },
  notFound: {
    title: "Nothing here.",
    body: "That page isn't part of the collection. Everything else is one click away.",
    back: "All work",
  },
  spending: {
    title: "Spending",
    description: "Every developer service Bo Hubbard pays for, out in the open.",
    updated: "Updated",
    /** Read before the total by screen readers; names the period, and the category when one is filtered. */
    totalLabel: (period: "monthly" | "yearly", category?: string) =>
      `${category ? `${category} spending` : "Spending"} per ${period === "yearly" ? "year" : "month"}:`,
    perMonth: "/mo",
    perYear: "/yr",
    about: "about",
    /** Under the total: the same total in the other period. */
    summary: (amount: string, per: "month" | "year", count: number) =>
      `${amount} a ${per} across ${count} ${count === 1 ? "service" : "services"}.`,
    intro: "Every developer service I pay for, out in the open. Mostly for fun, a little for accountability.",
    share: "Share of the shown total",
    /** Accessible name of the category filters; the first one shows everything. */
    filter: "Filter by category",
    all: "All",
    /** Accessible name of the monthly/yearly switch, and its two labels. */
    period: "Show prices",
    periods: { monthly: "Monthly", yearly: "Yearly" },
    note: "Prices in USD. A yearly plan counts as a twelfth each month; a monthly one, twelve times a year.",
  },
} as const;
