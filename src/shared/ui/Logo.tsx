"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { siteConfig } from "@/shared/config/site.config";

interface LogoProps {
  className?: string;
}

/**
 * Storefront wordmark that swaps to a dark-mode-specific logo file once
 * mounted (avoids a hydration mismatch, since the server always renders
 * the light-mode logo before next-themes resolves the stored preference).
 */
export function Logo({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "dark" ? "/pisaupedialogo2.png" : "/logo-pisaupedia.png";

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={siteConfig.name} className={className} />;
}
