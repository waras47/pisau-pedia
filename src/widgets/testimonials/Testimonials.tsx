import { type Review, ReviewCard } from "@/entities/review";
import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";
import { TestimonialsHeading } from "./TestimonialsHeading";

async function getTestimonials(): Promise<Review[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/reviews?per_page=6`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = (json.data ?? []) as Array<{
      id: string;
      customer_name: string;
      rating: number;
      content: string;
      photos?: string[];
      created_at: string;
    }>;
    return items.map((r) => ({
      id: r.id,
      author: r.customer_name,
      rating: r.rating,
      content: r.content,
      photos: r.photos,
      date: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function Testimonials() {
  const reviews = await getTestimonials();

  if (reviews.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16">
      <Container className="flex flex-col gap-10">
        <TestimonialsHeading />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
