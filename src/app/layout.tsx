import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer, Header } from '@/components/layout';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SharpEdge Shop — Premium Cutlery',
  description:
    'Handpicked premium knives from the world\'s finest bladesmiths. Shun, Wüsthof, Miyabi, Global, and more.',
  keywords: ['kitchen knives', 'chef knives', 'Japanese knives', 'premium cutlery', 'Shun', 'Wüsthof'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
