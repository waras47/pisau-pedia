import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";

import type { Product } from "@/entities/product";
import { KNIFE_TYPE_SLUGS, ProductCarousel } from "@/entities/product";
import { type ProductApiItem } from "@/entities/product/api/product.api";

import { KnivesRowHeading } from "./KnivesRowHeading";

// Max cards in the homepage row; the full list lives on /collections/knives.
const ROW_LIMIT = 12;

async function getProductsInCategory(slug: string): Promise<ProductApiItem[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?category=${slug}&per_page=50`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as ProductApiItem[]) ?? [];
  } catch {
    return [];
  }
}

// Same source and order as /collections/knives, so the row is a preview of
// that page.
async function getKnives(): Promise<Product[]> {
  const results = await Promise.all(KNIFE_TYPE_SLUGS.map(getProductsInCategory));
  return results
    .flat()
    .slice(0, ROW_LIMIT)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category ?? "",
      price: p.price,
      compareAtPrice: p.compare_at_price,
      currency: "IDR" as const,
      rating: p.rating,
      reviewCount: p.review_count,
      maker: p.maker,
      badge: p.badge as Product["badge"],
      image: p.image,
    }));
}

export async function KnivesRow() {
  const products = await getKnives();

  if (products.length === 0) return null;

  return (
    <section className="bg-muted/40 pb-16">
      <Container className="flex flex-col gap-10">
        <KnivesRowHeading />

        <ProductCarousel products={products} />
      </Container>
    </section>
  );
}
