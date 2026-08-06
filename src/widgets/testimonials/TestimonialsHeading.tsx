"use client";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { RatingStars } from "@/entities/product";
import { SectionHeading } from "@/shared/ui/SectionHeading";

export function TestimonialsHeading() {
  const { t } = useLocaleCurrency();

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <SectionHeading
        eyebrow={`2.845 ${t("testimonials_eyebrow")}`}
        title={t("testimonials_title")}
        align="center"
      />
      <RatingStars rating={4.9} size={18} />
    </div>
  );
}
