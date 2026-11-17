"use client";

import { Container } from "@/shared/ui/Container";
import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";

export function AnnouncementBar() {
  const { t } = useLocaleCurrency();

  return (
    <div className="bg-[#34a8eb] text-white">
      <Container className="flex h-9 items-center justify-center text-center">
        <p className="text-xs tracking-wide">
          {t("announcement_bar")}
        </p>
      </Container>
    </div>
  );
}
