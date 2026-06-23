import "./globals.css";

import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import { type ReactNode } from "react";

import { CartProvider } from "@/features/cart";
import { ThemeProvider } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config/site.config";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

import type { Metadata } from "next";

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
      <body className="font-body antialiased">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
