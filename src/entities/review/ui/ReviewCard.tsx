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
        &ldquo;{review.content}&rdquo;
      </p>
      {review.photos && review.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.photos.map((url, i) => (
            <img key={url} src={url} alt={`Review foto ${i + 1}`} className="h-16 w-16 rounded object-cover" />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}
