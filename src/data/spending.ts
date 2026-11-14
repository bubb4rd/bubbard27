import type { Icon } from "@phosphor-icons/react";
import { Cloud, GlobeHemisphereWest, SealCheck, Toolbox } from "@phosphor-icons/react/dist/ssr";

/**
 * Every developer service I pay for, shown at spending.bohubbard.xyz. Edit
 * this file to change the page: totals, shares and the strip all derive from
 * it. Prices in USD.
 */

/**
 * A row's mark: a brand logo (Simple Icons path, CC0) on the brand's colour,
 * or an image (a project's own app icon for domains, a supplied logo from
 * public/images/spending for brands Simple Icons lacks or draws off-brand).
 */
export type Mark = { logo: string; bg: string; fg: string; scale: string } | { image: string };

export type Service = {
  id: string;
  name: string;
  /** What it pays for, in a few words. */
  use: string;
  price: number;
  cycle: "monthly" | "yearly";
  /** Usage-based: the price is a typical month, shown as "about". */
  approx?: boolean;
  href: string;
  mark: Mark;
};

/** A category: its filter pill, and the icon that marks its services in the All list. */
export type Group = { title: string; icon: Icon; services: Service[] };

export const spending: { updated: string; groups: Group[] } = {
  /** ISO date of the last edit, shown in the header. */
  updated: "2026-11-13",
  groups: [
    {
      title: "Infrastructure",
      icon: Cloud,
      services: [
        {
          id: "supabase",
          name: "Supabase Pro",
          use: "Pro plan $25 + compute for 3 projects",
          // $25 Pro plan plus about $28.71 of compute; compute varies month to month, so it reads as "about".
          price: 53.71,
          cycle: "monthly",
          approx: true,
          href: "https://supabase.com",
          mark: {
            bg: "#1c1c1c",
            fg: "#3ecf8e",
            scale: "56%",
            logo: "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z",
          },
        },
        {
          id: "runpod",
          name: "Runpod",
          use: "Serverless GPU services",
          price: 5,
          cycle: "monthly",
          approx: true,
          href: "https://runpod.io",
          mark: { image: "/images/spending/runpod.png" },
        },
        {
          id: "google-cloud-vision",
          name: "Google Cloud Vision",
          use: "Vision API",
          price: 5,
          cycle: "monthly",
          approx: true,
          href: "https://cloud.google.com/vision",
          mark: { image: "/images/spending/google.png" },
        },
        {
          id: "resend",
          name: "Resend",
          use: "Authentication requests, OTPs",
          price: 5,
          cycle: "monthly",
          href: "https://resend.com",
          mark: {
            bg: "#000000",
            fg: "#ffffff",
            scale: "46%",
            logo: "M14.679 0c4.648 0 7.413 2.765 7.413 6.434s-2.765 6.434-7.413 6.434H12.33L24 24h-8.245l-8.88-8.44c-.636-.588-.93-1.273-.93-1.86 0-.831.587-1.565 1.713-1.883l4.574-1.224c1.737-.465 2.936-1.81 2.936-3.572 0-2.153-1.761-3.4-3.939-3.4H0V0z",
          },
        },
      ],
    },
    {
      title: "Tools",
      icon: Toolbox,
      services: [
        {
          id: "claude",
          name: "Claude Max",
          use: "",
          price: 100,
          cycle: "monthly",
          href: "https://claude.ai",
          mark: { image: "/images/spending/claude.png" },
        },
        {
          id: "google-ai-pro",
          name: "Google AI Pro",
          use: "",
          price: 20,
          cycle: "monthly",
          href: "https://one.google.com/about/ai-premium",
          mark: { image: "/images/spending/google.png" },
        },
        {
          id: "figma",
          name: "Figma",
          use: "",
          price: 16,
          cycle: "monthly",
          href: "https://figma.com",
          mark: {
            bg: "#1e1e1e",
            fg: "#ffffff",
            scale: "50%",
            logo: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
          },
        },
      ],
    },
    {
      title: "Platforms",
      // Both are signing programs: Apple notarization and Windows code signing.
      icon: SealCheck,
      services: [
        {
          id: "apple-developer",
          name: "Apple Developer Program",
          use: "iOS/macOS application signing",
          price: 99,
          cycle: "yearly",
          href: "https://developer.apple.com/programs/",
          mark: {
            bg: "#000000",
            fg: "#ffffff",
            scale: "54%",
            logo: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
          },
        },
        {
          id: "azure-signing",
          name: "Azure Artifact Signing",
          use: "Windows application signing",
          price: 10,
          cycle: "monthly",
          href: "https://azure.microsoft.com/products/artifact-signing",
          mark: { image: "/images/spending/azure.png" },
        },
      ],
    },
    {
      title: "Domains",
      icon: GlobeHemisphereWest,
      services: [
        {
          id: "bohubbard-xyz",
          name: "bohubbard.xyz",
          use: "",
          price: 19.99,
          cycle: "yearly",
          href: "https://bohubbard.xyz",
          mark: { image: "/images/bubbard-logo.png" },
        },
        {
          id: "borgwithus-xyz",
          name: "borgwithus.xyz",
          use: "",
          price: 19.99,
          cycle: "yearly",
          href: "https://borgwithus.xyz",
          mark: { image: "/images/BORGWITHUS.png" },
        },
        {
          id: "elovatesr-com",
          name: "elovatesr.com",
          use: "",
          price: 16.99,
          cycle: "yearly",
          href: "https://elovatesr.com",
          mark: { image: "/images/elovate-logo.png" },
        },
      ],
    },
  ],
};

/** What a service costs per month; yearly plans are spread over twelve. */
export const monthly = (s: Service) => (s.cycle === "yearly" ? s.price / 12 : s.price);

export const services = spending.groups.flatMap((g) => g.services);
export const totalMonthly = services.reduce((sum, s) => sum + monthly(s), 0);

const whole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** $25 for whole dollars, $8.25 otherwise. */
export const usd = (n: number) => (Number.isInteger(Math.round(n * 100) / 100) ? whole : cents).format(n);
