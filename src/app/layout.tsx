import "./globals.css";

import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import { type ReactNode } from "react";

import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site.config";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.tagline} — ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
