import type { Icon } from "@phosphor-icons/react";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr";
import type { FieldName } from "@/components/landing/Backdrop";
import type { WidgetName } from "@/components/landing/widgets";

/**
 * One element of a hover choreography. Positions are offsets from the icon's
 * centre and widths are in --u (about 10px on a laptop); r is the resting
 * rotation, tilt an optional 3D lean [rotateX, rotateY] in degrees, and fade
 * dissolves the bottom of a mockup so it rises from behind the icon. Pieces
 * pop out in array order: mockups first, then the small live widgets.
 */
export type Piece =
  | {
      kind: "card" | "phone" | "screen";
      src: string;
      aspect: string;
      w: number;
      x: number;
      y: number;
      r: number;
      tilt?: [number, number];
      fade?: boolean;
    }
  | { kind: "widget"; widget: WidgetName; x: number; y: number; r: number }
  | {
      kind: "chip" | "bubble";
      text: string;
      icon?: Icon;
      tone: "ink" | "mat" | "accent";
      x: number;
      y: number;
      r: number;
    };

export type Feature = {
  /** Project id. */
  id: string;
  label: string;
  /** Title set in the project's own face (a --font-* token) and colours. */
  font: "elovate" | "wkcc" | "vaultair";
  /** What the dot field behind the row becomes while this project is open. */
  field: FieldName;
  /** Each part can have its own text colour and a highlight fill behind it. */
  title: { text: string; color?: string; fill?: string }[];
  tagline: string;
  cta: string;
  pieces: Piece[];
};

/** The three projects on the landing page, in order, each with its own hover. */
export const featured: Feature[] = [
  {
    id: "wkcc-perks",
    label: "WKCC Perks",
    font: "wkcc",
    field: "ripple",
    title: [{ text: "WKCC", color: "#2E2A86" }, { text: " Perks" }],
    tagline: "Local deals for chamber members, one tap away",
    cta: "View WKCC Perks",
    pieces: [
      { kind: "phone", src: "/media/wkcc-perks/not-a-member.jpg", aspect: "886/1926", w: 12, x: -13, y: -15, r: -5, tilt: [4, 22], fade: true },
      { kind: "phone", src: "/media/wkcc-perks/member-card.jpg", aspect: "886/1926", w: 12, x: 13, y: -15, r: 5, tilt: [4, -22], fade: true },
      { kind: "phone", src: "/media/wkcc-perks/home.jpg", aspect: "886/1926", w: 13, x: 0, y: -18, r: 0, tilt: [5, 0], fade: true },
      { kind: "widget", widget: "WkccNotification", x: -16, y: -6, r: -3 },
      { kind: "widget", widget: "WkccCheckout", x: 19, y: -5, r: 5 },
    ],
  },
  {
    id: "elovatesr",
    label: "Elovate SR",
    font: "elovate",
    field: "climb",
    // "elo" sits on a block of the brand gold, with white text on it.
    title: [{ text: "elo", fill: "#EAB308", color: "#ffffff" }, { text: "vate" }],
    tagline: "Live Warzone ranks, a climb calculator and screenshot scanning",
    cta: "View Elovate",
    pieces: [
      { kind: "card", src: "/media/elovatesr/hover-profile.jpg", aspect: "1/1", w: 22, x: -10, y: -15, r: -5, tilt: [4, 14] },
      { kind: "card", src: "/media/elovatesr/hover-cutoff.jpg", aspect: "1/1", w: 24, x: 9, y: -18, r: 4, tilt: [4, -14] },
      { kind: "card", src: "/media/elovatesr/session-share-card.jpg", aspect: "2400/836", w: 19, x: -17, y: -30, r: -6 },
      { kind: "widget", widget: "EloLive", x: 21, y: -6, r: 3 },
    ],
  },
  {
    id: "vaultair",
    label: "Vaultair",
    font: "vaultair",
    field: "scramble",
    title: [{ text: "Vaultair" }],
    tagline: "An encrypted, local-first vault for every account you own",
    cta: "View Vaultair",
    pieces: [
      { kind: "screen", src: "/media/vaultair/lock-screen.jpg", aspect: "2400/1500", w: 28, x: -11, y: -15, r: -1, tilt: [6, 16], fade: true },
      { kind: "screen", src: "/media/vaultair/relationship-map.jpg", aspect: "2400/1500", w: 32, x: 9, y: -20, r: 1, tilt: [6, -16], fade: true },
      { kind: "widget", widget: "VaultHello", x: -17, y: -29, r: -4 },
      { kind: "widget", widget: "VaultSecret", x: 20, y: -5, r: 4 },
    ],
  },
];

/** The portrait's field: a selection on a design canvas. */
export const artistField: FieldName = "marquee";

/** The fourth item, the portrait: a selected frame on a canvas instead of screenshots. */
export const artistPieces: Piece[] = [
  { kind: "widget", widget: "BoFrame", x: 0, y: -19, r: -2 },
  { kind: "widget", widget: "BoCursor", x: 12, y: -9, r: 0 },
  { kind: "bubble", text: "Let's build something", tone: "accent", x: 15, y: -29, r: 5 },
  { kind: "chip", text: "C/O 2026", icon: GraduationCap, tone: "mat", x: -14, y: -25, r: -7 },
];
