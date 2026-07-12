import Link from "next/link";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

const categories = [
  {
    title: "Japanese Knives",
    href: "/collections/knives",
    label: "Knife collection",
    image: "/dev-images/products/aoi-gyuto-210.jpg",
  },
  {
    title: "Sharpening Tools",
    href: "/collections/sharpening",
    label: "Sharpening stones",
    image: "/dev-images/products/sharpening-stone.jpg",
  },
  {
    title: "Kitchen Accessories",
    href: "/collections/accessories",
    label: "Kitchen accessories",
    image: "/dev-images/products/magnetic-knife-holder-walnut.jpg",
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.label}
                className="aspect-[4/3] w-full object-cover"
              />
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
