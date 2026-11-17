import Link from "next/link";

import { env } from "@/shared/config/env";
import { Container } from "@/shared/ui/Container";

import { PromoImage } from "./PromoBannerClient";

interface ActivePromo {
  id: string;
  title: string;
  description?: string;
  discount_percent: number;
  popup_image?: string;
  start_date: string;
  end_date: string;
}

async function getActivePromo(): Promise<ActivePromo | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/site-promos/active`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export async function PromoBanner() {
  const promo = await getActivePromo();
  if (!promo) return null;

  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-0">
        <div className="flex flex-col items-center justify-center gap-6 py-8 lg:flex-row lg:gap-10">
          <PromoImage
            title={promo.title}
            discountPercent={promo.discount_percent}
            imageUrl={promo.popup_image}
          />

          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Diskon hingga {promo.discount_percent}%
            </p>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              {promo.title}
            </h2>
            {promo.description && (
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {promo.description}
              </p>
            )}
            <p className="text-sm text-foreground/80">
              Dari <span className="font-semibold">{formatDate(promo.start_date)}</span> sampai{" "}
              <span className="font-semibold">{formatDate(promo.end_date)}</span>
            </p>
            <Link
              href="/collections/knives"
              className="mt-2 inline-block border border-foreground px-8 py-3 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Belanja Sekarang &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
