import { type Review, reviews as staticReviews, ReviewCard } from "@/entities/review";
import { RatingStars } from "@/entities/product";
import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

async function getTestimonials(): Promise<Review[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products/featured/reviews`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return staticReviews;
    const json = await res.json();
    const items = (json.data ?? []) as Array<{
      id: string;
      author: string;
      rating: number;
      comment: string;
      created_at: string;
    }>;
    if (!items.length) return staticReviews;
    return items.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      content: r.comment,
      date: r.created_at,
    }));
  } catch {
    return staticReviews;
  }
}

export async function Testimonials() {
  const reviews = await getTestimonials();

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
