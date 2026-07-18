import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/shared/config/env";

import {
  getProductBySlug as getStaticProductBySlug,
  getRelatedProducts as getStaticRelatedProducts,
} from "@/entities/product";
import { type ProductApiDetail, type ProductApiItem } from "@/entities/product/api/product.api";
import { type Product } from "@/entities/product/model/product.types";

import { ProductDetail } from "@/widgets/product-detail";

interface ProductPageProps {
  params: { slug: string };
}

// Products created in the admin panel live in the real backend, not the
// static demo catalog below — this tries the API first (so admin data,
// including the 4-angle photos, actually shows up) and only falls back to
// the static catalog for the original demo/configurator products that were
// never migrated to the database.
async function getApiProduct(slug: string): Promise<ProductApiDetail | null> {
  const res = await fetch(`${env.apiBaseUrl}/products/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as ProductApiDetail;
}

async function getApiRelated(category: string, slug: string): Promise<Product[]> {
  if (!category) return [];
  const res = await fetch(`${env.apiBaseUrl}/products?per_page=50`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  const items = (json.data as ProductApiItem[]) ?? [];
  return items
    .filter((p) => p.category === category && p.slug !== slug)
    .slice(0, 4)
    .map(toProduct);
}

function toProduct(p: ProductApiItem | ProductApiDetail): Product {
  const detail = p as Partial<ProductApiDetail>;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category ?? "",
    price: p.price,
    compareAtPrice: p.compare_at_price,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.review_count,
    maker: p.maker,
    badge: p.badge as Product["badge"],
    stock: p.stock,
    weight: p.weight,
    image: p.image ?? detail.images?.[0],
    description: detail.description,
    careInstructions: detail.care_instructions,
    specs: detail.specs,
    highlights: detail.highlights,
    angleImages: detail.angle_images,
  };
}

// generateStaticParams intentionally omitted — product data now comes from
// the admin-managed backend (see getApiProduct above), so this route is
// rendered on demand (ISR via `revalidate`) rather than pre-built from the
// static demo catalog, matching the pattern already used by
// /collections/[handle].
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const apiProduct = await getApiProduct(params.slug);
  const product = apiProduct ? toProduct(apiProduct) : getStaticProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Kissaki Knives`,
    description: product.description ?? product.category,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const apiProduct = await getApiProduct(params.slug);

  if (apiProduct) {
    const product = toProduct(apiProduct);
    const related = await getApiRelated(product.category, product.slug);
    return <ProductDetail product={product} related={related} />;
  }

  const product = getStaticProductBySlug(params.slug);
  if (!product) notFound();

  const related = getStaticRelatedProducts(product);
  return <ProductDetail product={product} related={related} />;
}
