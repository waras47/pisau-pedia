import { reviews, ReviewCard } from "@/entities/review";
import { RatingStars } from "@/entities/product";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="bg-muted/40 py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <SectionHeading
            eyebrow="2,845 reviews and counting"
            title="Let customers speak for us"
            align="center"
          />
          <RatingStars rating={4.9} size={18} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
