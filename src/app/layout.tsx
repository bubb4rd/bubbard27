import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Nunito, Sora, Source_Serif_4, Space_Grotesk } from "next/font/google";
import { copy } from "@/content/copy";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Width axis lets the wordmark run extra-wide while headings stay normal width.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

// Project faces, used only for each featured project's title on hover.
// Elovate: geometric lowercase wordmark. WKCC Perks: the rounded type of its iOS UI.
// Vaultair: a technical grotesk for a security tool. Gliide: its Paper & Ink display serif.
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["800"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["600"] });
const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: { default: copy.meta.title, template: `%s · ${copy.meta.title}` },
  description: copy.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${sora.variable} ${nunito.variable} ${spaceGrotesk.variable} ${sourceSerif.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
