import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

export function ConfiguratorBanner() {
  return (
    <section className="bg-muted/40 py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <PlaceholderImage ratio="square" label="Blade options" />
          <div className="absolute -bottom-6 -right-6 hidden w-2/3 border-4 border-background sm:block">
            <PlaceholderImage ratio="square" label="Handle options" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <span className="font-accent text-lg italic text-copper">
            Endless possibilities
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            Build your knife with the configurator
          </h2>
          <p className="max-w-md text-muted-foreground">
            Choose a blade profile and steel, then match it with a custom
            handle, sheath, and engraving. One blade, made entirely yours.
          </p>
          <Link href="/pages/configurator">
            <Button size="lg" className="mt-2">
              Build a Knife
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
