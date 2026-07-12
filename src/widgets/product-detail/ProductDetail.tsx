"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  type Product,
  ProductGrid,
  RatingStars,
} from "@/entities/product";
import { reviews, ReviewCard } from "@/entities/review";
import { AddToCart } from "@/features/add-to-cart";
import { useLocaleCurrency } from "@/features/locale-currency";
import { Badge } from "@/shared/ui/Badge";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const { formatPrice } = useLocaleCurrency();
  const galleryLabels =
    product.galleryLabels ?? [product.category, "Detail", "In use"];

  return (
    <article className="py-10">
      <Container className="flex flex-col gap-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/collections/japanese-knives"
            className="hover:text-foreground"
          >
            Japanese Knives
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Galeri + Info */}
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <PlaceholderImage label={galleryLabels[0]} ratio="square" />
            )}
            <div className="grid grid-cols-3 gap-4">
              {galleryLabels.slice(1, 4).map((label) =>
                product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={label}
                    src={product.image}
                    alt={`${product.name} — ${label}`}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <PlaceholderImage key={label} label={label} ratio="square" />
                ),
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:pl-6">
            <div className="flex flex-col gap-3">
              <span className="font-accent text-base italic text-copper">
                {product.category}
              </span>
              <h1 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
                {product.name}
              </h1>

              {product.reviewCount > 0 ? (
                <RatingStars
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  No reviews yet
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAtPrice ? (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice, product.currency)}
                  </span>
                  <Badge variant="copper">Sale</Badge>
                </>
              ) : null}
            </div>

            {product.description ? (
              <p className="text-muted-foreground">{product.description}</p>
            ) : null}

            <AddToCart product={product} />

            {product.highlights?.length ? (
              <ul className="flex flex-col gap-2 border-t border-border pt-6">
                {product.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-copper" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Spesifikasi */}
        {product.specs?.length ? (
          <section className="grid gap-8 lg:grid-cols-3">
            <SectionHeading title="Specifications" />
            <dl className="divide-y divide-border border-y border-border lg:col-span-2">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-2 gap-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Reviews */}
        {product.reviewCount > 0 ? (
          <section className="flex flex-col gap-8">
            <SectionHeading eyebrow="What customers say" title="Reviews" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Produk terkait */}
        {related.length > 0 ? (
          <section className="flex flex-col gap-8">
            <SectionHeading title="You may also like" />
            <ProductGrid products={related} />
          </section>
        ) : null}
      </Container>
    </article>
  );
}
