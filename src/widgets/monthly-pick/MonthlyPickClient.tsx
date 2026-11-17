"use client";

import Link from "next/link";

import { RatingStars, type Product } from "@/entities/product";
import { useLocaleCurrency } from "@/features/locale-currency";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

export function MonthlyPickClient({ pick }: { pick: Product }) {
  const { formatPrice, t } = useLocaleCurrency();

  const discount = pick.compareAtPrice
    ? Math.round((1 - pick.price / pick.compareAtPrice) * 100)
    : 0;

  return (
    <section className="bg-surface py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        {pick.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pick.image}
            alt={pick.name}
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
            {pick.name}
          </h2>
          <RatingStars rating={pick.rating} reviewCount={pick.reviewCount} />
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">
              {formatPrice(pick.price, pick.currency)}
            </span>
            {pick.compareAtPrice ? (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(pick.compareAtPrice, pick.currency)}
              </span>
            ) : null}
            {discount > 0 && <Badge variant="copper">{t("save")} {discount}%</Badge>}
          </div>
          <p className="max-w-md text-muted-foreground">
            {t("monthly_desc")}
          </p>
          <Link href={`/products/${pick.slug}`}>
            <Button size="lg" className="mt-2">
              {t("shop_this_knife")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
