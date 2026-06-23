import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-6 animate-fade-up">
          <span className="font-accent text-lg italic text-copper">
            The heart of your kitchen
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl">
            Japanese kitchen
            <br />
            knives, made to
            <br />
            last a lifetime
          </h1>
          <p className="max-w-md text-muted-foreground">
            Hand-forged blades from Japan&apos;s finest workshops, selected for
            home cooks and professional chefs — and sharpened to a precision
            edge before they ever leave us.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/collections/knives">
              <Button size="lg">Find Your Knife</Button>
            </Link>
            <Link href="/pages/configurator">
              <Button size="lg" variant="outline">
                Build a Knife
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <PlaceholderImage
            ratio="portrait"
            label="Hero photography — hand-forged blade"
            className="clip-blade-br"
          />
        </div>
      </Container>
    </section>
  );
}
