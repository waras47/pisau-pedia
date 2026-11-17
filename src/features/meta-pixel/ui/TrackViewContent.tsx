"use client";

import { useEffect } from "react";

import { trackPixel } from "@/shared/lib/meta-pixel";

interface TrackViewContentProps {
  id: string;
  name: string;
  category?: string;
  price: number;
  currency?: string;
}

/** Event ViewContent untuk halaman produk (dipakai iklan katalog & retargeting). */
export function TrackViewContent({ id, name, category, price, currency }: TrackViewContentProps) {
  useEffect(() => {
    trackPixel("ViewContent", {
      content_ids: [id],
      content_type: "product",
      content_name: name,
      content_category: category,
      value: price,
      currency: currency || "IDR",
    });
  }, [id, name, category, price, currency]);

  return null;
}
