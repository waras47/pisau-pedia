"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, User } from "lucide-react";

import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";
import { IconButton } from "@/shared/ui/IconButton";

import { useAuth } from "@/features/auth/model/AuthProvider";
import { CartButton } from "@/features/cart";
import { LocaleToggle } from "@/features/locale-currency";
import { SearchModal } from "@/features/search";
import { ThemeToggle } from "@/features/theme-toggle";

import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { status, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <AnnouncementBar />

      <Container className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-3 lg:hidden">
          <IconButton label="Open menu" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </IconButton>
        </div>

        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pisaupedia.png" alt={siteConfig.name} className="h-16 w-auto" />
        </Link>

        <MegaMenu />

        <div className="flex items-center gap-1">
          <IconButton
            label="Search"
            className="hidden sm:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={19} />
          </IconButton>
          {status === "authenticated" ? (
            <div className="relative inline-flex">
              <button
                type="button"
                aria-label={user?.full_name ?? "Account"}
                onClick={() => setAccountMenuOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-muted"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {(user?.full_name?.[0] ?? "?").toUpperCase()}
                </span>
              </button>
              {accountMenuOpen ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAccountMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-background py-1 shadow-lg">
                    <Link
                      href="/account/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Pengaturan Akun
                    </Link>
                    <Link
                      href="/account/addresses"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Alamat Saya
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Pesanan Saya
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
                    >
                      Keluar
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Link
              href="/account/login"
              aria-label="Account"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-muted"
            >
              <User size={19} />
            </Link>
          )}
          <div className="hidden items-center sm:flex">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <CartButton />
        </div>
      </Container>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSearchClick={() => {
          setMobileMenuOpen(false);
          setSearchOpen(true);
        }}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
