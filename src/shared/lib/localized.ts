import type { Locale } from "@/shared/i18n/dictionaries";

export function localized(
  data: Record<string, unknown> | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!data) return "";
  const suffixed = data[`${field}_${locale}`];
  if (typeof suffixed === "string" && suffixed) return suffixed;
  const plain = data[field];
  return typeof plain === "string" ? plain : "";
}
