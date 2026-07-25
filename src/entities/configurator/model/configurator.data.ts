import {
  type KnifeAccessory,
  type KnifeBlade,
  type KnifeHandle,
  type KnifeShape,
} from "./configurator.types";

export const CURRENCY = "EUR";

// Langkah 1 — bentuk pisau
export const shapes: KnifeShape[] = [
  { id: "gyuto", name: "Gyuto", category: "Multi-Purpose", image: "/dev-images/configurator/shape-gyuto.webp", previewImage: "/dev-images/configurator/preview-outline.png", silhouetteLight: "http://localhost:9000/pisaupedia/configurator/shapes/gyuto-black.png", silhouetteDark: "http://localhost:9000/pisaupedia/configurator/shapes/gyuto-grey.png" },
  { id: "santoku", name: "Santoku", category: "Multi-Purpose", image: "/dev-images/configurator/shape-santoku.webp", previewImage: "/dev-images/configurator/preview-outline.png", silhouetteLight: "http://localhost:9000/pisaupedia/configurator/shapes/santoku-black.png", silhouetteDark: "http://localhost:9000/pisaupedia/configurator/shapes/santoku-grey.png" },
  { id: "bunka", name: "Bunka", category: "Multi-Purpose", image: "/dev-images/configurator/shape-bunka.webp", previewImage: "/dev-images/configurator/preview-outline.png", silhouetteLight: "http://localhost:9000/pisaupedia/configurator/shapes/bunka-black.png", silhouetteDark: "http://localhost:9000/pisaupedia/configurator/shapes/bunka-grey.png" },
  { id: "nakiri", name: "Nakiri", category: "Vegetable", image: "/dev-images/configurator/blade-nakiri-1.jpg", previewImage: "/dev-images/configurator/preview-outline.png" },
  { id: "petty", name: "Petty", category: "Paring", image: "/dev-images/configurator/blade-petty-1.jpg", previewImage: "/dev-images/configurator/preview-outline.png" },
];

// Langkah 2 — blade, masing-masing terikat ke satu shape (shapeId)
export const blades: KnifeBlade[] = [
  {
    id: "aoi-gyuto-210",
    image: "/dev-images/configurator/blade-gyuto-1.jpg",
    shapeId: "gyuto",
    name: "Aoi Gyuto 210mm",
    steel: "Aogami #2",
    lengthMm: 210,
    price: 248,
    compareAtPrice: 310,
    previewImage: "/dev-images/configurator/preview-blade-gyuto-hap40.png",
    description: "The Aoi Gyuto is forged from Aogami #2 (Blue Steel #2), prized for its exceptional edge retention and ease of sharpening. Each blade is individually hand-forged with a distinctive Kurouchi (black forge) finish that adds rustic beauty while providing a natural non-stick surface. The 210mm length is ideal for home cooks who want a versatile, all-purpose chef knife.",
    specifications: { "Steel": "Aogami #2 (Blue Steel #2)", "Length": "210mm", "Hardness": "62-63 HRC", "Finish": "Kurouchi", "Grind": "Double bevel", "Weight": "165g" },
  },
  {
    id: "yama-gyuto-240",
    image: "/dev-images/configurator/blade-gyuto-2.jpg",
    shapeId: "gyuto",
    name: "Yama Gyuto 240mm",
    steel: "VG-10",
    lengthMm: 240,
    price: 296,
    previewImage: "/dev-images/configurator/preview-blade-gyuto-suj2.png",
    description: "The Yama Gyuto features VG-10 stainless steel — a premium Japanese steel that balances corrosion resistance with excellent sharpness. The longer 240mm blade provides more cutting surface, making it the preferred choice for professional chefs who handle large volumes of ingredients. Damascus-clad layers create a stunning wave pattern.",
    specifications: { "Steel": "VG-10 (66-layer Damascus)", "Length": "240mm", "Hardness": "60-61 HRC", "Finish": "Damascus Tsuchime", "Grind": "Double bevel", "Weight": "185g" },
  },
  {
    id: "sumi-santoku-180",
    image: "/dev-images/configurator/blade-santoku-1.jpg",
    shapeId: "santoku",
    name: "Sumi Santoku 180mm",
    steel: "Aogami #2",
    lengthMm: 180,
    price: 162,
    previewImage: "/dev-images/configurator/preview-blade-santoku-zdp.png",
    description: "The Sumi Santoku is a versatile three-virtue blade — excelling at slicing, dicing, and mincing. Forged from Aogami #2, it takes an incredibly sharp edge. The flat belly profile and shorter length make it perfect for precise vegetable work and quick chopping tasks. A true kitchen workhorse.",
    specifications: { "Steel": "Aogami #2 (Blue Steel #2)", "Length": "180mm", "Hardness": "62-63 HRC", "Finish": "Kurouchi", "Grind": "Double bevel", "Weight": "148g" },
  },
  {
    id: "ginrei-santoku-170",
    image: "/dev-images/configurator/blade-santoku-2.jpg",
    shapeId: "santoku",
    name: "Ginrei Santoku 170mm",
    steel: "VG-10",
    lengthMm: 170,
    price: 136,
    previewImage: "/dev-images/configurator/preview-blade-santoku-zdp.png",
    description: "The Ginrei Santoku combines VG-10 stainless steel with a compact 170mm blade — ideal for smaller hands or kitchens with limited space. The stain-resistant steel requires less maintenance than carbon steel while still achieving razor sharpness. A great entry point into Japanese cutlery.",
    specifications: { "Steel": "VG-10", "Length": "170mm", "Hardness": "60-61 HRC", "Finish": "Mirror polish", "Grind": "Double bevel", "Weight": "135g" },
  },
  {
    id: "kuro-bunka-190",
    image: "/dev-images/configurator/bunka1.webp",
    shapeId: "bunka",
    name: "Kuro Bunka 190mm",
    steel: "Shirogami #2",
    lengthMm: 190,
    price: 176,
    compareAtPrice: 220,
    previewImage: "/dev-images/configurator/preview-blade-bunka-hap40.png",
    description: "The Kuro Bunka features Shirogami #2 (White Steel #2), known for achieving the sharpest possible edge among traditional Japanese steels. The bunka profile with its distinctive k-tip excels at precise cutting and fine tip work. The Kurouchi finish protects the blade and adds character.",
    specifications: { "Steel": "Shirogami #2 (White Steel #2)", "Length": "190mm", "Hardness": "63-64 HRC", "Finish": "Kurouchi", "Grind": "Double bevel", "Weight": "155g" },
  },
  {
    id: "hap40-bunka-190",
    image: "/dev-images/configurator/bunka2.webp",
    shapeId: "bunka",
    name: "HAP-40 Bunka Black 190mm",
    steel: "HAP-40",
    lengthMm: 190,
    price: 228,
    compareAtPrice: 285,
    previewImage: "/dev-images/configurator/preview-blade-bunka-zdp-silver.png",
    description: "The HAP-40 Bunka Black is our premium bunka offering. HAP-40 is a high-speed powder steel that combines extreme hardness with surprising toughness — it holds its edge far longer than conventional steels. The black Kurouchi finish gives it a bold, industrial aesthetic. For serious cooks who demand the best.",
    specifications: { "Steel": "HAP-40 (High-speed powder steel)", "Length": "190mm", "Hardness": "64-66 HRC", "Finish": "Kurouchi Black", "Grind": "Double bevel", "Weight": "160g" },
  },
  {
    id: "tsuchime-nakiri-165",
    image: "/dev-images/configurator/blade-nakiri-1.jpg",
    shapeId: "nakiri",
    name: "Tsuchime Nakiri 165mm",
    steel: "VG-10",
    lengthMm: 165,
    price: 138,
    previewImage: "/dev-images/configurator/preview-blade-bunka-hap40.png",
    description: "The Tsuchime Nakiri is a dedicated vegetable knife with a straight edge and tall blade — perfect for clean push cuts through root vegetables and leafy greens. The hammered (tsuchime) finish creates small air pockets that help food release from the blade. VG-10 steel offers low-maintenance sharpness.",
    specifications: { "Steel": "VG-10", "Length": "165mm", "Hardness": "60-61 HRC", "Finish": "Tsuchime (hammered)", "Grind": "Double bevel", "Weight": "158g" },
  },
  {
    id: "mori-nakiri-170",
    image: "/dev-images/configurator/blade-nakiri-2.png",
    shapeId: "nakiri",
    name: "Mori Nakiri 170mm",
    steel: "Aogami #2",
    lengthMm: 170,
    price: 148,
    previewImage: "/dev-images/configurator/preview-blade-bunka-zdp-silver.png",
    description: "The Mori Nakiri pairs the classic vegetable knife profile with Aogami #2 carbon steel for ultimate sharpness. The slightly longer 170mm blade gives extra cutting surface for larger vegetables. Carbon steel develops a unique patina over time, making each knife truly one-of-a-kind.",
    specifications: { "Steel": "Aogami #2 (Blue Steel #2)", "Length": "170mm", "Hardness": "62-63 HRC", "Finish": "Kurouchi", "Grind": "Double bevel", "Weight": "168g" },
  },
  {
    id: "hibana-petty-120",
    image: "/dev-images/configurator/blade-petty-1.jpg",
    shapeId: "petty",
    name: "Hibana Petty 120mm",
    steel: "Shirogami #2",
    lengthMm: 120,
    price: 86,
    previewImage: "/dev-images/configurator/preview-blade-gyuto-hap40.png",
    description: "The Hibana Petty is a compact utility knife for detail work — peeling, trimming, and precision cuts that larger knives can't handle. Shirogami #2 takes an exceptionally keen edge, making this small blade feel surgical. An essential companion to your main chef knife.",
    specifications: { "Steel": "Shirogami #2 (White Steel #2)", "Length": "120mm", "Hardness": "63-64 HRC", "Finish": "Kurouchi", "Grind": "Double bevel", "Weight": "58g" },
  },
];

// Langkah 3 — handle (priceDelta = tambahan harga)
export const handles: KnifeHandle[] = [
  { id: "magnolia", name: "Magnolia", material: "Magnolia wood", priceDelta: 0, image: "/dev-images/configurator/handle-magnolia-single.jpg", previewImage: "/dev-images/configurator/preview-handle-magnolia.png", previewColor: "#E4D9BE" },
  { id: "walnut", name: "Walnut", material: "Walnut wood", priceDelta: 20, image: "/dev-images/configurator/handle-walnut-single.jpg", previewImage: "/dev-images/configurator/preview-handle-kyoto.png", previewColor: "#6B4A35" },
  { id: "horn", name: "Buffalo Horn", material: "Magnolia + horn", priceDelta: 35, image: "/dev-images/configurator/handle-horn-single.jpg", previewImage: "/dev-images/configurator/preview-handle-rosewood.png", previewColor: "#2B2A28" },
  { id: "ebony", name: "Ebony", material: "Ebony + horn", priceDelta: 45, image: "/dev-images/configurator/handle-ebony-single.jpg", previewImage: "/dev-images/configurator/preview-handle-ebony.png", previewColor: "#1C1712" },
];

// Langkah 4 — accessories (opsional, bisa pilih lebih dari satu)
export const accessories: KnifeAccessory[] = [
  { id: "saya", name: "Magnolia Saya (sheath)", price: 24, image: "/dev-images/products/wooden-saya-gyuto-210.jpg" },
  { id: "engraving", name: "Custom Engraving", price: 15, image: "/dev-images/products/custom-engraving.jpg" },
  { id: "board", name: "Ginko Cutting Board", price: 58, image: "/dev-images/products/ginko-cutting-board-s.jpg" },
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
