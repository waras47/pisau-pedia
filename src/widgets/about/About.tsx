import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

const values = [
  {
    icon: <HammerIcon />,
    title: "Hand-Forged, Not Mass-Produced",
    description:
      "Every blade passes through a blacksmith's hands — hammered, ground, and hand-finished on whetstones. No two edges are ever quite the same.",
  },
  {
    icon: <MapPinIcon />,
    title: "Sourced Directly From Sakai",
    description:
      "We work directly with small workshops in Sakai, Japan's centuries-old cutlery district, cutting out the layers of resale that usually sit between forge and kitchen.",
  },
  {
    icon: <LeafIcon />,
    title: "Materials That Last",
    description:
      "From high-carbon steels to hand-selected magnolia and ebony for handles, we choose materials for how they perform after ten years, not just on day one.",
  },
  {
    icon: <HeartIcon />,
    title: "A Team That Actually Cooks",
    description:
      "Everyone who answers your questions has used the knives we sell — in a home kitchen, not just behind a desk. Ask us anything before you buy.",
  },
];

const milestones = [
  { year: "1998", label: "Founded in Sakai, Japan" },
  { year: "2011", label: "First worldwide shipping" },
  { year: "2019", label: "Mail-in sharpening service launched" },
  { year: "Today", label: "Thousands of kitchens, one edge at a time" },
];

export function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">Our Story</span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl lg:text-6xl">
            Hand-forged in Sakai, made for your kitchen
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            KISSAKI started as a small effort to bring genuine, hand-forged
            Japanese kitchen knives to cooks outside Japan — without the
            markups and guesswork that usually come with buying blades from
            overseas. We&apos;re still doing exactly that.
          </p>
        </Container>
      </section>

      {/* Story */}
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <SectionHeading
              eyebrow="Since 1998"
              title="Started in a small workshop, still run the same way"
            />
            <p className="text-muted-foreground">
              KISSAKI began with a handful of relationships built directly
              with blacksmiths in Sakai — a city that has shaped Japanese
              cutlery for hundreds of years. Rather than buying through
              distributors, we visit the workshops, learn how each maker
              forges and finishes their blades, and bring that knowledge back
              to how we describe and care for every knife we sell.
            </p>
            <p className="text-muted-foreground">
              That hasn&apos;t changed as we&apos;ve grown. Every knife in our
              catalog is still chosen because someone on our team has used
              it, sharpened it, and would put it in their own kitchen drawer.
            </p>
          </div>
          <PlaceholderImage label="Workshop in Sakai" ratio="landscape" />
        </Container>
      </section>

      {/* Values */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            align="center"
            eyebrow="What we stand for"
            title="Craftsmanship over shortcuts"
            className="mx-auto"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3">
                <span className="text-copper">{v.icon}</span>
                <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Milestones */}
      <section className="py-16">
        <Container>
          <SectionHeading align="center" title="Along the way" className="mx-auto mb-12" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.label} className="flex flex-col gap-2 border-t-2 border-copper pt-4 text-center">
                <span className="font-display text-2xl font-bold text-copper">{m.year}</span>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Workshop gallery */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            align="center"
            eyebrow="Behind the blade"
            title="From forge to your kitchen"
            className="mx-auto"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <PlaceholderImage label="Forging the blade" ratio="portrait" />
            <PlaceholderImage label="Hand-sharpening" ratio="portrait" />
            <PlaceholderImage label="Final inspection" ratio="portrait" />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tightest sm:text-3xl">
            Ready to find your knife?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Browse the full collection, or message us on WhatsApp if
            you&apos;re not sure which blade fits how you cook.
          </p>
          <Link href="/collections/knives">
            <Button size="lg">Shop All Knives</Button>
          </Link>
        </Container>
      </section>
    </>
  );
}

function HammerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
