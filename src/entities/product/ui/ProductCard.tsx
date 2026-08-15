"use client";

import Link from "next/link";

import { Badge } from "@/shared/ui/Badge";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { type Product } from "@/entities/product/model/product.types";
import { RatingStars } from "@/entities/product/ui/RatingStars";

import { useLocaleCurrency } from "@/features/locale-currency";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function discountPercent(price: number, compareAt: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { formatPrice, t } = useLocaleCurrency();
  const isSoldOut = product.badge === "sold-out";
  const discount = product.compareAtPrice ? discountPercent(product.price, product.compareAtPrice) : 0;

  const media = (
    <div className="relative">
      {product.image ? (
        <div className="aspect-[15/8] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-contain ${isSoldOut ? "grayscale" : ""}`}
          />
        </div>
      ) : (
        <PlaceholderImage label={product.category} ratio="landscape" />
      )}
      {isSoldOut ? (
        <Badge variant="neutral" className="absolute left-2 top-2 px-1.5 py-0.5 text-[9px] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          Sold Out
        </Badge>
      ) : product.badge === "new" ? (
        <Badge variant="neutral" className="absolute left-2 top-2 px-1.5 py-0.5 text-[9px] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          New
        </Badge>
      ) : discount > 0 ? (
        <Badge variant="copper" className="absolute left-2 top-2 px-1.5 py-0.5 text-[9px] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          Save {discount}%
        </Badge>
      ) : null}
    </div>
  );

  const info = (
    <div className="flex flex-col gap-1">
      <h3 className="font-body text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
        {product.name}
      </h3>

      {product.reviewCount > 0 ? (
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
      ) : (
        <span className="text-xs text-muted-foreground">{t("no_reviews_yet")}</span>
      )}

      <div className="flex items-center gap-2 pt-0.5">
        {isSoldOut ? (
          <span className="text-sm text-muted-foreground">{t("sold_out")}</span>
        ) : (
          <>
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );

  if (isSoldOut) {
    return (
      <div
        aria-disabled="true"
        className={`flex w-full cursor-not-allowed flex-col gap-3 opacity-60 ${className ?? ""}`}
      >
        {media}
        {info}
      </div>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      {media}
      {info}
    </Link>
  );
}
