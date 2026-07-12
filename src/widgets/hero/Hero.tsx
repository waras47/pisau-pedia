import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

import { HeroImageSlider } from "./HeroImageSlider";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black lg:min-h-[640px]">
      <HeroImageSlider />

      <Container className="relative z-10 py-16 lg:py-20">
        <div className="flex max-w-xl flex-col gap-6 animate-fade-up">
          <span className="font-accent text-lg italic text-copper">
            The heart of your kitchen
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-5xl lg:text-6xl">
            Japanese kitchen
            <br />
            knives, made to
            <br />
            last a lifetime
          </h1>
          <p className="max-w-md text-white/75">
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
              className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-white transition-colors hover:text-copper"
            >
              Build a Knife
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs uppercase tracking-widest2 text-white/60">
            Hand-forged in Sakai, Japan — since 1998
          </p>
        </div>
      </Container>
    </section>
  );
}
