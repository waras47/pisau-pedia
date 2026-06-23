import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { newArrivals, ProductCarousel } from "@/entities/product";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

export function NewArrivals() {
  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading title="Shop New Arrivals" />
          <Link
            href="/collections/new-arrivals"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-accent sm:inline-flex"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <ProductCarousel products={newArrivals} />
      </Container>
    </section>
  );
}
