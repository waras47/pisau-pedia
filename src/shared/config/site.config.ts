export const siteConfig = {
  name: "Pisau Pedia",
  tagline: "Pisau Dapur Berkualitas, Asli Indonesia",
  description:
    "Pisaupedia menghadirkan pisau dapur berkualitas asli Indonesia dengan pilihan material sesuai kebutuhan Anda. Melayani pesanan khusus perorangan & restoran, penggantian handle, pembuatan sarung pisau, dan perbaikan pisau.",
  // TODO: ganti dengan domain production sungguhan begitu sudah di-deploy.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pisaupedia.com",
  freeShippingThreshold: 300,
  currency: "EUR",
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
    // TODO: ganti dengan nomor WhatsApp admin sungguhan (format: kode negara + nomor, tanpa "+" atau spasi)
    whatsapp: "6281234567890",
  },
} as const;
