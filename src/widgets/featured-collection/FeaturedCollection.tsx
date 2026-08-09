import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";

import { ProductCarousel } from "@/entities/product";
import type { Product } from "@/entities/product";

import { FeaturedBanner } from "./FeaturedBanner";

async function getFeatured(): Promise<Product[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=8&sort=popular`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json.data as Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      compare_at_price?: number;
      category?: string;
      rating: number;
      review_count: number;
      badge?: string;
      maker?: string;
      images?: Array<{ url: string; alt: string }>;
    }>;
    if (!items?.length) return [];
    return items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      currency: "IDR" as const,
      category: p.category ?? "",
      rating: p.rating,
      reviewCount: p.review_count,
      badge: p.badge as "new" | "sale" | "sold-out" | undefined,
      maker: p.maker,
      image: p.images?.[0]?.url,
    }));
  } catch {
    return [];
  }
}

export async function FeaturedCollection() {
  const products = await getFeatured();

  return (
    <section className="bg-muted/40 py-16">
      <Container className="flex flex-col gap-10">
        <FeaturedBanner />

        {products.length > 0 ? (
          <ProductCarousel products={products} />
        ) : (
          <p className="text-center text-sm text-gray-400">Belum ada produk.</p>
        )}
      </Container>
    </section>
  );
}
