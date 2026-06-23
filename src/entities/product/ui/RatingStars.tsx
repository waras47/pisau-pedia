import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = 14,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={cn(
              index < Math.round(rating)
                ? "fill-gold text-gold"
                : "fill-transparent text-border",
            )}
          />
        ))}
      </div>
      {typeof reviewCount === "number" ? (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      ) : null}
    </div>
  );
}
