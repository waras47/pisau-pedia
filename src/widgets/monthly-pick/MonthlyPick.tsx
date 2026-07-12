"use client";

import Link from "next/link";

import { monthlyPick, RatingStars } from "@/entities/product";
import { useLocaleCurrency } from "@/features/locale-currency";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

export function MonthlyPick() {
  const { formatPrice, t } = useLocaleCurrency();
  return (
    <section className="bg-surface py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        {monthlyPick.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={monthlyPick.image}
            alt={monthlyPick.name}
            className="clip-blade-tr aspect-[4/3] w-full object-cover lg:order-2"
          />
        ) : (
          <PlaceholderImage
            ratio="landscape"
            label="Knife of the month"
            className="clip-blade-tr lg:order-2"
          />
        )}

        <div className="flex flex-col items-start gap-4 lg:order-1">
          <span className="font-accent text-lg italic text-copper">
            {t("knife_of_the_month")}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {monthlyPick.name}
          </h2>
          <RatingStars rating={monthlyPick.rating} reviewCount={monthlyPick.reviewCount} />
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">
              {formatPrice(monthlyPick.price, monthlyPick.currency)}
            </span>
            {monthlyPick.compareAtPrice ? (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(monthlyPick.compareAtPrice, monthlyPick.currency)}
              </span>
            ) : null}
            <Badge variant="copper">{t("save")} 20%</Badge>
          </div>
          <p className="max-w-md text-muted-foreground">
            A balanced, everyday santoku with a nashiji-finished blade —
            handpicked each month for the value it brings to a home kitchen.
          </p>
          <Link href={`/products/${monthlyPick.slug}`}>
            <Button size="lg" className="mt-2">
              {t("shop_this_knife")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
