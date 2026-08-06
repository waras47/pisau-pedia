import {
  newArrivals as staticNewArrivals,
  ProductCarousel,
} from "@/entities/product";
import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";
import { NewArrivalsHeading } from "./NewArrivalsHeading";

async function getNewArrivals() {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products/new-arrivals`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return staticNewArrivals;
    const json = await res.json();
    const items = json.data as Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      compare_at_price?: number;
      category_name?: string;
      rating: number;
      review_count: number;
      badge?: string;
      maker?: string;
      images?: Array<{ url: string; alt: string }>;
    }>;
    if (!items?.length) return staticNewArrivals;
    return items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      currency: "IDR" as const,
      category: p.category_name ?? "",
      rating: p.rating,
      reviewCount: p.review_count,
      badge: p.badge as "new" | "sale" | "sold-out" | undefined,
      maker: p.maker,
      image: p.images?.[0]?.url,
    }));
  } catch {
    return staticNewArrivals;
  }
}

export async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <NewArrivalsHeading />

        <ProductCarousel products={products} />
      </Container>
    </section>
  );
}
