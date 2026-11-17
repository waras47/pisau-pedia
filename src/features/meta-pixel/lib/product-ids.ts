import { env } from "@/shared/config/env";

/**
 * Petakan slug produk ke UUID produk (ID yang dipakai feed katalog Meta).
 * Slug yang tidak ditemukan dikembalikan apa adanya.
 */
export async function resolveProductIds(slugs: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const slug of slugs) map[slug] = slug;
  if (!slugs.length) return map;
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=100`);
    if (!res.ok) return map;
    const json = (await res.json()) as { data?: Array<{ id: string; slug: string }> };
    for (const p of json.data ?? []) {
      if (p?.slug && p.id && p.slug in map) map[p.slug] = p.id;
    }
  } catch {
    // jaringan gagal — pakai slug sebagai cadangan
  }
  return map;
}
