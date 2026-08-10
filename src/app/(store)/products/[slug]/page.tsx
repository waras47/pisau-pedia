import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/shared/config/env";

import {
  getProductBySlug as getStaticProductBySlug,
  getRelatedProducts as getStaticRelatedProducts,
} from "@/entities/product";
import { type ProductApiDetail, type ProductApiItem } from "@/entities/product/api/product.api";
import { type Product } from "@/entities/product/model/product.types";
import { type Review } from "@/entities/review";

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
  const res = await fetch(`${env.apiBaseUrl}/products/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as ProductApiDetail;
}

async function getApiReviews(slug: string): Promise<Review[]> {
  try {
    const res = await fetch(
      `${env.apiBaseUrl}/reviews?product_slug=${encodeURIComponent(slug)}&scope=product&per_page=50`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items = (json.data ?? []) as Array<{
      id: string;
      customer_name: string;
      rating: number;
      content: string;
      photos?: string[];
      created_at: string;
    }>;
    return items.map((r) => ({
      id: r.id,
      author: r.customer_name,
      rating: r.rating,
      content: r.content,
      photos: r.photos,
      date: r.created_at,
    }));
  } catch {
    return [];
  }
}

async function getApiRelated(category: string, slug: string): Promise<Product[]> {
  if (!category) return [];
  const res = await fetch(`${env.apiBaseUrl}/products?per_page=50`, { cache: "no-store" });
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
    descriptionEn: detail.description_en,
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
    title: `${product.name} — Pisau Pedia`,
    description: product.description ?? product.category,
  };
}

function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.category,
    image: product.image,
    brand: { "@type": "Brand", name: "Pisau Pedia" },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.badge === "sold-out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const apiProduct = await getApiProduct(params.slug);

  if (apiProduct) {
    const product = toProduct(apiProduct);
    const [related, reviews] = await Promise.all([
      getApiRelated(product.category, product.slug),
      getApiReviews(params.slug),
    ]);
    return (
      <>
        <ProductJsonLd product={product} />
        <ProductDetail product={product} related={related} reviews={reviews} />
      </>
    );
  }

  const product = getStaticProductBySlug(params.slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    Promise.resolve(getStaticRelatedProducts(product)),
    getApiReviews(params.slug),
  ]);
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetail product={product} related={related} reviews={reviews} />
    </>
  );
}
