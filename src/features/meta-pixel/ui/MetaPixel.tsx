"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackPixel } from "@/shared/lib/meta-pixel";

/**
 * Memuat Meta Pixel dan mengirim PageView di setiap perpindahan halaman.
 * Dipasang di layout toko saja, jadi halaman admin tidak ikut terlacak.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    trackPixel("PageView");
  }, [pathname]);

  return null;
}
