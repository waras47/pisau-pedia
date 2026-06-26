export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  badge?: "new" | "sale" | "sold-out";
  slug: string;
  maker?: string;
  // — field opsional untuk halaman detail —
  description?: string;
  highlights?: string[];
  specs?: ProductSpec[];
  galleryLabels?: string[];

  // — diisi hanya untuk komponen dari configurator (blade/handle/accessory) —
  component?: {
    kind: "blade" | "handle" | "accessory";
    refId: string;
  };
}
