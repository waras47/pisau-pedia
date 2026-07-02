import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { featuredProducts, ProductCarousel } from "@/entities/product";
import { Badge } from "@/shared/ui/Badge";
import { Container } from "@/shared/ui/Container";

export function FeaturedCollection() {
  return (
    <section className="bg-muted/40 py-16">
      <Container className="flex flex-col gap-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dev-images/products/kuro-bunka-190.jpg"
            alt="Tanaka Forge Damascus bunka knife"
            className="aspect-[4/3] w-full bg-muted object-contain"
          />
          <div className="flex flex-col items-start gap-4">
            <Badge variant="copper">20% Off — Until June 21</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
              Featured Maker: Tanaka Forge
            </h2>
            <p className="max-w-md text-muted-foreground">
              Ten years of the ZDP-189 Bunka. To mark the anniversary, the
              entire Tanaka Forge collection is 20% off, with free custom
              engraving on every blade.
            </p>
            <Link
              href="/collections/tanaka-forge"
              className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-accent"
            >
              Shop Tanaka Forge knives
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <ProductCarousel products={featuredProducts} />
      </Container>
    </section>
  );
}
