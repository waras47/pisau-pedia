import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

export function QuizBanner() {
  return (
    <section className="bg-surface py-16">
      <Container>
        <div className="relative overflow-hidden bg-accent text-accent-foreground">
          <div className="grid items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:py-16">
            <div className="flex flex-col items-start gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest2 text-accent-foreground/70">
                Quiz
              </span>
              <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
                Not sure where to start?
              </h2>
              <p className="max-w-md text-accent-foreground/80">
                Answer a few quick questions and we&apos;ll guide you to the
                blade that fits how you actually cook.
              </p>
              <Link href="/pages/quiz">
                <Button variant="secondary" size="lg" className="mt-2">
                  Take the Quiz
                </Button>
              </Link>
            </div>
            <PlaceholderImage
              ratio="landscape"
              label="Quiz preview"
              className="opacity-90"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
