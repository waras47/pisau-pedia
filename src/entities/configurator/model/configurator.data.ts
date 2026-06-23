import {
  type KnifeAccessory,
  type KnifeBlade,
  type KnifeHandle,
  type KnifeShape,
} from "./configurator.types";

export const CURRENCY = "EUR";

// Langkah 1 — bentuk pisau
export const shapes: KnifeShape[] = [
  { id: "gyuto", name: "Gyuto", category: "Multi-Purpose" },
  { id: "santoku", name: "Santoku", category: "Multi-Purpose" },
  { id: "bunka", name: "Bunka", category: "Multi-Purpose" },
  { id: "nakiri", name: "Nakiri", category: "Vegetable" },
  { id: "petty", name: "Petty", category: "Paring" },
];

// Langkah 2 — blade, masing-masing terikat ke satu shape (shapeId)
export const blades: KnifeBlade[] = [
  {
    id: "aoi-gyuto-210",
    shapeId: "gyuto",
    name: "Aoi Gyuto 210mm",
    steel: "Aogami #2",
    lengthMm: 210,
    price: 248,
    compareAtPrice: 310,
  },
  {
    id: "yama-gyuto-240",
    shapeId: "gyuto",
    name: "Yama Gyuto 240mm",
    steel: "VG-10",
    lengthMm: 240,
    price: 296,
  },
  {
    id: "sumi-santoku-180",
    shapeId: "santoku",
    name: "Sumi Santoku 180mm",
    steel: "Aogami #2",
    lengthMm: 180,
    price: 162,
  },
  {
    id: "ginrei-santoku-170",
    shapeId: "santoku",
    name: "Ginrei Santoku 170mm",
    steel: "VG-10",
    lengthMm: 170,
    price: 136,
  },
  {
    id: "kuro-bunka-190",
    shapeId: "bunka",
    name: "Kuro Bunka 190mm",
    steel: "Shirogami #2",
    lengthMm: 190,
    price: 176,
    compareAtPrice: 220,
  },
  {
    id: "hap40-bunka-190",
    shapeId: "bunka",
    name: "HAP-40 Bunka Black 190mm",
    steel: "HAP-40",
    lengthMm: 190,
    price: 228,
    compareAtPrice: 285,
  },
  {
    id: "tsuchime-nakiri-165",
    shapeId: "nakiri",
    name: "Tsuchime Nakiri 165mm",
    steel: "VG-10",
    lengthMm: 165,
    price: 138,
  },
  {
    id: "mori-nakiri-170",
    shapeId: "nakiri",
    name: "Mori Nakiri 170mm",
    steel: "Aogami #2",
    lengthMm: 170,
    price: 148,
  },
  {
    id: "hibana-petty-120",
    shapeId: "petty",
    name: "Hibana Petty 120mm",
    steel: "Shirogami #2",
    lengthMm: 120,
    price: 86,
  },
];

// Langkah 3 — handle (priceDelta = tambahan harga)
export const handles: KnifeHandle[] = [
  { id: "magnolia", name: "Magnolia", material: "Magnolia wood", priceDelta: 0 },
  { id: "walnut", name: "Walnut", material: "Walnut wood", priceDelta: 20 },
  { id: "horn", name: "Buffalo Horn", material: "Magnolia + horn", priceDelta: 35 },
  { id: "ebony", name: "Ebony", material: "Ebony + horn", priceDelta: 45 },
];

// Langkah 4 — accessories (opsional, bisa pilih lebih dari satu)
export const accessories: KnifeAccessory[] = [
  { id: "saya", name: "Magnolia Saya (sheath)", price: 24 },
  { id: "engraving", name: "Custom Engraving", price: 15 },
  { id: "board", name: "Ginko Cutting Board", price: 58 },
];

/** Blade yang tersedia untuk sebuah shape. */
export function getBladesByShape(shapeId: string): KnifeBlade[] {
  return blades.filter((b) => b.shapeId === shapeId);
}

/** Jenis komponen pisau yang masuk cart sebagai item terpisah. */
export type ComponentKind = "blade" | "handle" | "accessory";

/**
 * Hitung harga, nama & kategori 1 komponen (blade / handle / accessory)
 * dari id-nya. Dipakai:
 *  - configurator saat menambah tiap komponen sebagai item terpisah, dan
 *  - server /api/checkout untuk menghitung ulang harga (anti-tamper).
 * Mengembalikan null jika id tak valid.
 */
export function priceComponent(
  kind: ComponentKind,
  refId: string,
): { price: number; name: string; category: string } | null {
  switch (kind) {
    case "blade": {
      const b = blades.find((x) => x.id === refId);
      return b ? { price: b.price, name: b.name, category: "Blade" } : null;
    }
    case "handle": {
      const h = handles.find((x) => x.id === refId);
      return h
        ? { price: h.priceDelta, name: `${h.name} Handle`, category: "Handle" }
        : null;
    }
    case "accessory": {
      const a = accessories.find((x) => x.id === refId);
      return a ? { price: a.price, name: a.name, category: "Accessory" } : null;
    }
    default:
      return null;
  }
}
