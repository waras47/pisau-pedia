import Link from "next/link";

import { formatPrice } from "@/entities/product/lib/format-price";
import { type Product } from "@/entities/product/model/product.types";
import { RatingStars } from "@/entities/product/ui/RatingStars";
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
  const isSoldOut = product.badge === "sold-out";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      <div className="relative">
        <PlaceholderImage label={product.category} ratio="square" />
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
          <span className="text-xs text-muted-foreground">No reviews yet</span>
        )}

        <div className="flex items-center gap-2 pt-0.5">
          {isSoldOut ? (
            <span className="text-sm text-muted-foreground">Sold Out</span>
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
