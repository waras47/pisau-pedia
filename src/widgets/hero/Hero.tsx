import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

import { HeroImageSlider } from "./HeroImageSlider";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-6 animate-fade-up">
          <span className="font-accent text-lg italic text-copper">
            The heart of your kitchen
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
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
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link href="/collections/knives">
              <Button size="lg">Find Your Knife</Button>
            </Link>
            <Link
              href="/pages/configurator"
              className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-foreground transition-colors hover:text-copper"
            >
              Build a Knife
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs uppercase tracking-widest2 text-muted-foreground">
            Hand-forged in Sakai, Japan — since 1998
          </p>
        </div>

        <div className="relative">
          <HeroImageSlider />
        </div>
      </Container>
    </section>
  );
}
