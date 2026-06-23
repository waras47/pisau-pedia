import Link from "next/link";

import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

const categories = [
  {
    title: "Japanese Knives",
    href: "/collections/knives",
    label: "Knife collection",
  },
  {
    title: "Sharpening Tools",
    href: "/collections/sharpening",
    label: "Sharpening stones",
  },
  {
    title: "Kitchen Accessories",
    href: "/collections/accessories",
    label: "Kitchen accessories",
  },
];

export function BrowseCategories() {
  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading title="Browse Our Selection" align="center" />
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="group flex flex-col gap-4">
              <PlaceholderImage ratio="portrait" label={category.label} />
              <span className="text-center font-display text-lg font-medium transition-colors group-hover:text-accent">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
