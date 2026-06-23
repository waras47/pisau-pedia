"use client";

import Link from "next/link";
import { useState } from "react";

import { mainNav } from "@/entities/navigation";
import { Container } from "@/shared/ui/Container";

export function MegaMenu() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <nav
      className="hidden lg:block"
      onMouseLeave={() => setOpenLabel(null)}
      aria-label="Main"
    >
      <ul className="flex items-center gap-8">
        {mainNav.map((item) => (
          <li key={item.label} onMouseEnter={() => setOpenLabel(item.label)}>
            <Link
              href={item.href}
              className="flex items-center py-5 text-sm font-medium uppercase tracking-widest2 text-foreground transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {mainNav.map((item) =>
        item.columns && openLabel === item.label ? (
          <div
            key={item.label}
            className="absolute inset-x-0 top-full z-40 border-t border-border bg-surface shadow-lg"
          >
            <Container className="grid grid-cols-3 gap-10 py-10">
              {item.columns.map((column) => (
                <div key={column.title} className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest2 text-muted-foreground">
                    {column.title}
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-foreground/90 transition-colors hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Container>
          </div>
        ) : null,
      )}
    </nav>
  );
}
