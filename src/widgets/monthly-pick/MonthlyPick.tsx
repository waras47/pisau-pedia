import Link from "next/link";

import { RatingStars, type Product } from "@/entities/product";
import { env } from "@/shared/config/env";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { MonthlyPickClient } from "./MonthlyPickClient";

async function getMonthlyPick(): Promise<Product | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=1&sort=bestseller`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const items = json.data as Array<Record<string, unknown>>;
    if (!items?.length) return null;
    const p = items[0]!;
    return {
      id: p.id as string,
      name: p.name as string,
      slug: p.slug as string,
      price: p.price as number,
      compareAtPrice: (p.compare_at_price as number) || undefined,
      currency: "IDR",
      category: (p.category as string) ?? "",
      rating: p.rating as number,
      reviewCount: p.review_count as number,
      badge: p.badge as Product["badge"],
      image: p.image as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function MonthlyPick() {
  const pick = await getMonthlyPick();

  if (!pick) return null;

  return <MonthlyPickClient pick={pick} />;
}
