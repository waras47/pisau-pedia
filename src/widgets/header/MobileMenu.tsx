"use client";

import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { mainNav } from "@/entities/navigation";
import { cn } from "@/shared/lib/utils";
import { IconButton } from "@/shared/ui/IconButton";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-surface transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="font-display text-lg font-semibold">Menu</span>
          <IconButton label="Close menu" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.label} className="border-b border-border">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="text-sm font-medium uppercase tracking-widest2 text-foreground"
                  >
                    {item.label}
                  </Link>
                  {item.columns ? (
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() =>
                        setExpanded(expanded === item.label ? null : item.label)
                      }
                      className="p-1 text-muted-foreground"
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          "transition-transform duration-200",
                          expanded === item.label && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </div>

                {item.columns && expanded === item.label ? (
                  <div className="flex flex-col gap-4 pb-4 pl-1">
                    {item.columns.map((column) => (
                      <div key={column.title} className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest2 text-muted-foreground">
                          {column.title}
                        </span>
                        <ul className="flex flex-col gap-2">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="text-sm text-foreground/90"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
