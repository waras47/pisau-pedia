import { RatingStars } from "@/entities/product/ui/RatingStars";
import { type Review } from "@/entities/review/model/review.types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 border border-border bg-surface p-6">
      <RatingStars rating={review.rating} size={14} />
      <p className="flex-1 text-sm leading-relaxed text-foreground/90">
        “{review.content}”
      </p>
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}
