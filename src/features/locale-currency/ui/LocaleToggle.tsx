"use client";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";

export function LocaleToggle() {
  const { locale, setLocale } = useLocaleCurrency();

  function toggle() {
    setLocale(locale === "id" ? "en" : "id");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
    >
      <span className={locale === "id" ? "text-accent" : "text-muted-foreground"}>ID</span>
      <span className="text-muted-foreground">/</span>
      <span className={locale === "en" ? "text-accent" : "text-muted-foreground"}>EN</span>
    </button>
  );
}
