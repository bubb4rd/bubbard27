import type { WidgetName } from "@/components/landing/widgets";

/**
 * One element of a hover choreography. Positions are offsets from the centre
 * of the stage near the foot of its landing card, and widths are in --u (2% of
 * the cover's width); r is the resting rotation, tilt an optional 3D lean
 * [rotateX, rotateY] in degrees, and fade dissolves the bottom of a mockup so
 * it rises out of the cover. Pieces pop out in array order: mockups first,
 * then the small live widgets.
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
  | { kind: "widget"; widget: WidgetName; x: number; y: number; r: number };

export type Feature = {
  /** Project id. */
  id: string;
  /** Title set in the project's own face (a --font-* token) and colours. */
  font: "elovate" | "wkcc" | "vaultair" | "gliide";
  /** Each part can have its own text colour and a highlight fill behind it. */
  title: { text: string; color?: string; fill?: string }[];
  pieces: Piece[];
};

/**
 * The landing cards' hovers, one per project that has one. Gliide is drawn in
 * its Paper & Ink system: Source Serif display type, graphite ink, one cobalt
 * accent, green for points gained.
 */
export const features: Feature[] = [
  {
    id: "wkcc-perks",
    font: "wkcc",
    title: [{ text: "WKCC", color: "#2E2A86" }, { text: " Perks" }],
    pieces: [
      { kind: "phone", src: "/media/wkcc-perks/not-a-member.jpg", aspect: "886/1926", w: 12, x: -13, y: -15, r: -5, tilt: [4, 22], fade: true },
      { kind: "phone", src: "/media/wkcc-perks/member-card.jpg", aspect: "886/1926", w: 12, x: 13, y: -15, r: 5, tilt: [4, -22], fade: true },
      { kind: "phone", src: "/media/wkcc-perks/home.jpg", aspect: "886/1926", w: 13, x: 0, y: -18, r: 0, tilt: [5, 0], fade: true },
      { kind: "widget", widget: "WkccCheckout", x: 19, y: -5, r: 5 },
    ],
  },
  {
    id: "elovatesr",
    font: "elovate",
    // "elo" sits on a block of the brand gold, with white text on it.
    title: [{ text: "elo", fill: "#EAB308", color: "#ffffff" }, { text: "vate" }],
    pieces: [
      { kind: "card", src: "/media/elovatesr/hover-profile.jpg", aspect: "1/1", w: 22, x: -10, y: -15, r: -5, tilt: [4, 14] },
      { kind: "card", src: "/media/elovatesr/hover-cutoff.jpg", aspect: "1/1", w: 24, x: 9, y: -18, r: 4, tilt: [4, -14] },
      { kind: "widget", widget: "EloLive", x: 21, y: -6, r: 3 },
    ],
  },
  {
    id: "vaultair",
    font: "vaultair",
    title: [{ text: "Vaultair" }],
    pieces: [
      { kind: "screen", src: "/media/vaultair/lock-screen.jpg", aspect: "2400/1500", w: 28, x: -11, y: -15, r: -1, tilt: [6, 16], fade: true },
      { kind: "screen", src: "/media/vaultair/relationship-map.jpg", aspect: "2400/1500", w: 32, x: 9, y: -20, r: 1, tilt: [6, -16], fade: true },
      { kind: "widget", widget: "VaultSecret", x: 20, y: -5, r: 4 },
    ],
  },
  {
    id: "gliide",
    font: "gliide",
    title: [{ text: "gl" }, { text: "ii", color: "oklch(0.45 0.207 263.8)" }, { text: "de" }],
    pieces: [
      { kind: "card", src: "/media/gliide/cover-letter-light.jpg", aspect: "2400/1500", w: 26, x: -9, y: -17, r: -4, tilt: [4, 14] },
      { kind: "card", src: "/media/gliide/tailor-fit-score.jpg", aspect: "1262/837", w: 26, x: 10, y: -21, r: 3, tilt: [4, -14] },
      { kind: "widget", widget: "GliideFeed", x: -11, y: -4, r: -3 },
      { kind: "widget", widget: "GliideFit", x: 19, y: -6, r: 4 },
    ],
  },
];
