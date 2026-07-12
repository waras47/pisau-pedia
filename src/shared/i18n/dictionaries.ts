export type Locale = "en" | "id";

const en = {
  search: "Search",
  account: "Account",
  cart: "Cart",
  subtotal: "Subtotal",
  checkout: "Checkout",
  continue_shopping: "Continue Shopping",
  add_to_cart: "Add to Cart",
  sold_out: "Sold Out",
  no_reviews_yet: "No reviews yet",
  knife_of_the_month: "Knife of the month",
  shop_this_knife: "Shop This Knife",
  save: "Save",
  your_cart: "Your Cart",
  cart_empty: "Your cart is empty.",
  order_summary: "Order Summary",
};

const id = {
  search: "Cari",
  account: "Akun",
  cart: "Keranjang",
  subtotal: "Subtotal",
  checkout: "Checkout",
  continue_shopping: "Lanjut Belanja",
  add_to_cart: "Tambah ke Keranjang",
  sold_out: "Stok Habis",
  no_reviews_yet: "Belum ada ulasan",
  knife_of_the_month: "Pisau Pilihan Bulan Ini",
  shop_this_knife: "Beli Pisau Ini",
  save: "Hemat",
  your_cart: "Keranjang Kamu",
  cart_empty: "Keranjang kamu masih kosong.",
  order_summary: "Ringkasan Pesanan",
};

export const dictionaries: Record<Locale, typeof en> = { en, id };
export type DictionaryKey = keyof typeof en;
