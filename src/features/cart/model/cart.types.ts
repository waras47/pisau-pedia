import { type Product } from "@/entities/product";

/** Snapshot produk + quantity. Hanya simpan field yang dibutuhkan untuk tampilan cart. */
export interface CartItem {
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
  // diisi untuk komponen configurator → dipakai server saat checkout
  component?: {
    kind: "blade" | "handle" | "accessory";
    refId: string;
  };
}

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
}
