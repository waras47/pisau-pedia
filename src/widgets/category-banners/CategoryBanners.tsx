import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

const banners = [
  {
    title: "Sharpening",
    description: "Stones and tools to keep every blade in top-notch shape.",
    href: "/collections/sharpening",
    cta: "Discover Sharpening Tools",
    label: "Sharpening stone in use",
  },
  {
    title: "Accessories",
    description: "Cutting boards, holders, and kitchen tools that earn their keep.",
    href: "/collections/accessories",
    cta: "Browse Accessories",
    label: "Kitchen accessories",
  },
];

export function CategoryBanners() {
  return (
    <section className="bg-surface py-16">
      <Container className="grid gap-6 sm:grid-cols-2">
        {banners.map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative flex flex-col justify-end overflow-hidden"
          >
            <PlaceholderImage ratio="landscape" label={banner.label} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-background">
              <h3 className="font-display text-2xl font-semibold">{banner.title}</h3>
              <p className="max-w-xs text-sm text-background/85">
                {banner.description}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest2">
                {banner.cta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </Container>
    </section>
  );
}
