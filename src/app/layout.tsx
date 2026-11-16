import { type ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";

import { siteConfig } from "@/shared/config/site.config";

import "./globals.css";

// Font di-host sendiri (latin subset, variable) supaya build tidak bergantung
// pada fetch ke fonts.googleapis.com, yang bikin `next/font/google` gagal di CI.
const spaceGrotesk = localFont({
  src: [{ path: "./fonts/space-grotesk-variable.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const inter = localFont({
  src: [{ path: "./fonts/inter-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/newsreader-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `${siteConfig.tagline} — ${siteConfig.name}`,
  description: siteConfig.description,
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.tagline} — ${siteConfig.name}`,
    description: siteConfig.description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: Object.values(siteConfig.social).filter((url) => url.startsWith("http")),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <body className="font-body antialiased">
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5FF9C3V852"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5FF9C3V852');`}
        </Script>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
