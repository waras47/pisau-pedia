"use client";

import Link from "next/link";

import { type Product } from "@/entities/product/model/product.types";
import { RatingStars } from "@/entities/product/ui/RatingStars";
import { useLocaleCurrency } from "@/features/locale-currency";
import { Badge } from "@/shared/ui/Badge";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeLabel: Record<NonNullable<Product["badge"]>, string> = {
  new: "New",
  sale: "Sale",
  "sold-out": "Sold Out",
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { formatPrice, t } = useLocaleCurrency();
  const isSoldOut = product.badge === "sold-out";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      <div className="relative">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <PlaceholderImage label={product.category} ratio="landscape" />
        )}
        {product.badge ? (
          <Badge
            variant={product.badge === "sale" ? "copper" : "neutral"}
            className="absolute left-3 top-3"
          >
            {badgeLabel[product.badge]}
          </Badge>
        ) : null}
      </div>

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
    </Link>
  );
}
