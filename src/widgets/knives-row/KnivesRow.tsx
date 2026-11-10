import { env } from "@/shared/config/env";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";

import type { Product } from "@/entities/product";
import { KNIFE_TYPE_SLUGS, ProductCard } from "@/entities/product";
import { type ProductApiItem } from "@/entities/product/api/product.api";

import { KnivesRowHeading } from "./KnivesRowHeading";

// Two rows of the 4-column desktop grid; the full list lives on /collections/knives.
const ROW_LIMIT = 8;

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

        {/* Exactly two full rows at every breakpoint: 2×2 mobile, 3×2 md, 4×2 lg. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={cn(i >= 4 && "hidden md:block", i >= 6 && "md:hidden lg:block")}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
