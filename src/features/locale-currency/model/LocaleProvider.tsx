"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { env } from "@/shared/config/env";
import { dictionaries, type DictionaryKey, type Locale } from "@/shared/i18n/dictionaries";

const STORAGE_KEY = "pp_locale";
const DEFAULT_LOCALE: Locale = "id";

type Currency = "USD" | "IDR";

const localeToCurrency: Record<Locale, Currency> = { en: "USD", id: "IDR" };
const localeToIntl: Record<Locale, string> = { en: "en-US", id: "id-ID" };

interface LocaleContextValue {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
  formatPrice: (amount: number, sourceCurrency: string) => string;
  /** Convert an amount from sourceCurrency into the active display currency (numeric). */
  convert: (amount: number, sourceCurrency: string) => number;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/exchange-rate`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.rates) setRates(json.data.rates);
      })
      .catch(() => {
        // Silently fall back to raw (unconverted) prices — better than a
        // broken page if the exchange-rate API is unreachable.
      });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const currency = localeToCurrency[locale];

  const t = useCallback(
    (key: DictionaryKey) => dictionaries[locale][key] ?? key,
    [locale],
  );

  const convert = useCallback(
    (amount: number, sourceCurrency: string) => {
      const target = currency;
      if (rates && sourceCurrency !== target) {
        const fromRate = rates[sourceCurrency];
        const toRate = rates[target];
        if (fromRate && toRate) {
          return (amount / fromRate) * toRate;
        }
      }
      return amount;
    },
    [currency, rates],
  );

  const formatPrice = useCallback(
    (amount: number, sourceCurrency: string) => {
      const target = currency;
      return new Intl.NumberFormat(localeToIntl[locale], {
        style: "currency",
        currency: target,
        maximumFractionDigits: target === "IDR" ? 0 : 2,
      }).format(convert(amount, sourceCurrency));
    },
    [locale, currency, convert],
  );

  const value = useMemo(
    () => ({ locale, currency, setLocale, t, formatPrice, convert }),
    [locale, currency, setLocale, t, formatPrice, convert],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleCurrency() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleCurrency must be used within LocaleProvider");
  return ctx;
}
