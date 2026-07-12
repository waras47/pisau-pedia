"use client";

import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CartButton } from "@/features/cart";
import { LocaleToggle } from "@/features/locale-currency";
import { ThemeToggle } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config/site.config";
import { BladeMark } from "@/shared/icons";
import { Container } from "@/shared/ui/Container";
import { IconButton } from "@/shared/ui/IconButton";

import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <AnnouncementBar />

      <Container className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-3 lg:hidden">
          <IconButton label="Open menu" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </IconButton>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tightest"
        >
          <BladeMark className="h-6 w-6 text-accent" />
          {siteConfig.name}
        </Link>

        <MegaMenu />

        <div className="flex items-center gap-1">
          <IconButton label="Search" className="hidden sm:inline-flex">
            <Search size={19} />
          </IconButton>
          <IconButton label="Account" className="hidden sm:inline-flex">
            <User size={19} />
          </IconButton>
          <LocaleToggle />
          <ThemeToggle />
          <CartButton />
        </div>
      </Container>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
