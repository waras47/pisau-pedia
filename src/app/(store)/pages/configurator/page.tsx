import { type Metadata } from "next";

import { env } from "@/shared/config/env";

import type {
  KnifeAccessory,
  KnifeBlade,
  KnifeHandle,
  KnifeShape,
} from "@/entities/configurator";

import { KnifeConfigurator } from "@/features/knife-configurator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knife Configurator — Pisau Pedia",
  description: "Build your own custom Japanese knife, blade to handle.",
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}${path}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

function mapShapes(
  items: Array<{ id: string; name: string; category: string; description?: string; image_url?: string }>,
): KnifeShape[] {
  return items.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    image: s.image_url,
    silhouetteLight: s.image_url,
    silhouetteDark: s.image_url,
  }));
}

function mapBlades(
  items: Array<{
    id: string;
    shape_id: string;
    name: string;
    steel: string;
    length_mm: number;
    price: number;
    compare_at_price?: number;
    description?: string;
    specifications?: Record<string, string>;
    image_url?: string;
  }>,
): KnifeBlade[] {
  return items.map((b) => ({
    id: b.id,
    shapeId: b.shape_id,
    name: b.name,
    steel: b.steel,
    lengthMm: b.length_mm,
    price: b.price,
    compareAtPrice: b.compare_at_price,
    description: b.description,
    specifications: b.specifications,
    image: b.image_url,
  }));
}

function mapHandles(
  items: Array<{
    id: string;
    name: string;
    material: string;
    price_delta: number;
    image_url?: string;
  }>,
): KnifeHandle[] {
  return items.map((h) => ({
    id: h.id,
    name: h.name,
    material: h.material,
    priceDelta: h.price_delta,
    image: h.image_url,
  }));
}

function mapAccessories(
  items: Array<{ id: string; name: string; price: number; image_url?: string }>,
): KnifeAccessory[] {
  return items.map((a) => ({
    id: a.id,
    name: a.name,
    price: a.price,
    image: a.image_url,
  }));
}

export default async function ConfiguratorPage() {
  const [rawShapes, rawBlades, rawHandles, rawAccessories] = await Promise.all([
    fetchJson<Array<Record<string, unknown>>>("/configurator/shapes"),
    fetchJson<Array<Record<string, unknown>>>("/configurator/blades"),
    fetchJson<Array<Record<string, unknown>>>("/configurator/handles"),
    fetchJson<Array<Record<string, unknown>>>("/configurator/accessories"),
  ]);

  return (
    <KnifeConfigurator
      apiShapes={rawShapes ? mapShapes(rawShapes as Parameters<typeof mapShapes>[0]) : undefined}
      apiBlades={rawBlades ? mapBlades(rawBlades as Parameters<typeof mapBlades>[0]) : undefined}
      apiHandles={rawHandles ? mapHandles(rawHandles as Parameters<typeof mapHandles>[0]) : undefined}
      apiAccessories={rawAccessories ? mapAccessories(rawAccessories as Parameters<typeof mapAccessories>[0]) : undefined}
    />
  );
}
