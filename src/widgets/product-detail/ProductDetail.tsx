"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import {
  type Product,
  ProductGrid,
  RatingStars,
} from "@/entities/product";
import { type Review, ReviewCard } from "@/entities/review";

import { AddToCart } from "@/features/add-to-cart";
import { useLocaleCurrency } from "@/features/locale-currency";

interface ProductDetailProps {
  product: Product;
  related: Product[];
  reviews?: Review[];
}

const ANGLE_ENTRIES: { key: "front" | "back" | "side" | "top"; label: string }[] = [
  { key: "front", label: "Depan" },
  { key: "back", label: "Belakang" },
  { key: "side", label: "Samping" },
  { key: "top", label: "Atas" },
];

// Shown when a product has no admin-provided care notes — general guidance
// valid for any kitchen knife, not specific to one product.
const DEFAULT_CARE_TIPS = [
  "Cuci tangan dengan air hangat dan sabun segera setelah dipakai — jangan direndam, dan jangan dicuci di mesin cuci piring.",
  "Keringkan segera dengan lap bersih sebelum disimpan untuk mencegah karat, terutama untuk pisau baja karbon.",
  "Simpan di knife block, magnetic strip, atau sarung pisau — hindari menyimpan lepas di laci bersama alat lain.",
  "Gunakan talenan kayu atau plastik yang lunak — hindari talenan kaca atau keramik yang bisa menumpulkan mata pisau.",
  "Asah secara berkala dengan whetstone atau honing rod untuk menjaga ketajaman mata pisau.",
];

export function ProductDetail({ product, related, reviews = [] }: ProductDetailProps) {
  const { formatPrice, locale } = useLocaleCurrency();
  const description = (locale === "en" && product.descriptionEn) ? product.descriptionEn : product.description;
  const galleryLabels =
    product.galleryLabels ?? [product.category, "Detail", "In use"];

  const availableAngles = ANGLE_ENTRIES.filter(({ key }) => product.angleImages?.[key]);
  const hasAngleImages = availableAngles.length > 0;
  const [selectedAngle, setSelectedAngle] = useState(
    availableAngles[0]?.key ?? ANGLE_ENTRIES[0]!.key,
  );
  const [activeTab, setActiveTab] = useState<"description" | "specification" | "care">(
    "description",
  );

  const mainImage = hasAngleImages
    ? product.angleImages?.[selectedAngle]
    : product.image;

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specification", label: "Specification" },
    ...(product.careInstructions ? [{ key: "care" as const, label: "Knife Care" }] : []),
  ];

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
            {mainImage ? (
              // Box ratio matches the product photo set's actual aspect
              // ratio (~1.875:1 / 15:8) — object-cover on a square box was
              // cropping the tip/handle off. object-contain + matching
              // ratio shows the full knife with no letterboxing.
              <div className="aspect-[15/8] w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <PlaceholderImage
                label={hasAngleImages ? ANGLE_ENTRIES.find((a) => a.key === selectedAngle)?.label : galleryLabels[0]}
                ratio="video"
              />
            )}

            {hasAngleImages ? (
              <div className="grid grid-cols-4 gap-4">
                {ANGLE_ENTRIES.map(({ key, label }) => {
                  const url = product.angleImages?.[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedAngle(key)}
                      className={`relative aspect-[15/8] w-full overflow-hidden border bg-muted transition-colors ${
                        selectedAngle === key ? "border-foreground" : "border-transparent"
                      }`}
                    >
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={`${product.name} — ${label}`} className="h-full w-full object-contain" />
                      ) : (
                        <PlaceholderImage label={label} ratio="video" />
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-background/80 py-0.5 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {galleryLabels.slice(1, 4).map((label) =>
                  product.image ? (
                    <div key={label} className="aspect-[15/8] w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={`${product.name} — ${label}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <PlaceholderImage key={label} label={label} ratio="video" />
                  ),
                )}
              </div>
            )}
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

            {description ? (
              <p className="text-muted-foreground">{description}</p>
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

        {/* Description / Specification / Knife Care */}
        <section className="flex flex-col gap-8">
          <div className="flex gap-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description ?? "Deskripsi lengkap untuk produk ini akan segera ditambahkan."}
            </p>
          ) : null}

          {activeTab === "specification" ? (
            product.specs?.length ? (
              <dl className="max-w-3xl divide-y divide-border border-y border-border">
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
            ) : (
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Spesifikasi lengkap untuk produk ini akan segera ditambahkan.
              </p>
            )
          ) : null}

          {activeTab === "care" ? (
            product.careInstructions ? (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.careInstructions}
              </p>
            ) : (
              <ul className="flex max-w-3xl flex-col gap-2.5">
                {DEFAULT_CARE_TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-copper" />
                    {tip}
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </section>

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
