import { env } from "@/shared/config/env";
import { siteConfig } from "@/shared/config/site.config";

// Google Merchant Center product feed (RSS 2.0 + g: namespace). Lets Merchant
// Center pull products directly instead of relying on its site-crawl scanner
// (unreliable right after a domain migration — Google hasn't indexed the new
// domain's product pages yet). Point Merchant Center's "Tambahkan produk dari
// file" at https://pisaupedia.com/feed.xml — it re-fetches this periodically,
// so price/stock changes show up without manual re-upload.

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category?: string;
  maker?: string;
  stock?: number;
  image?: string;
  description?: string;
}

async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as ApiProduct[];
  } catch {
    return [];
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = siteConfig.siteUrl;
  const products = await fetchProducts();

  const items = products
    .map((p) => {
      const inStock = (p.stock ?? 0) > 0;
      const title = escapeXml(p.name);
      const description = escapeXml(p.description || p.category || p.name);
      return `  <item>
    <g:id>${p.id}</g:id>
    <title>${title}</title>
    <description>${description}</description>
    <link>${base}/products/${p.slug}</link>
    ${p.image ? `<g:image_link>${escapeXml(p.image)}</g:image_link>` : ""}
    <g:availability>${inStock ? "in stock" : "out of stock"}</g:availability>
    <g:price>${p.price} ${p.currency || "IDR"}</g:price>
    <g:brand>${escapeXml(p.maker || "Pisau Pedia")}</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${escapeXml(siteConfig.name)} — Product Feed</title>
  <link>${base}</link>
  <description>${escapeXml(siteConfig.description)}</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
