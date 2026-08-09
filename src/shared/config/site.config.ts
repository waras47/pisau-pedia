export const siteConfig = {
  name: "Pisau Pedia",
  tagline: "Pisau Dapur Berkualitas, Asli Indonesia",
  description:
    "Pisaupedia menghadirkan pisau dapur berkualitas asli Indonesia dengan pilihan material sesuai kebutuhan Anda. Melayani pesanan khusus perorangan & restoran, penggantian handle, pembuatan sarung pisau, dan perbaikan pisau.",
  // TODO: ganti dengan domain production sungguhan begitu sudah di-deploy.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pisaupedia.com",
  freeShippingThreshold: 500000,
  currency: "IDR",
  social: {
    instagram: "https://www.instagram.com/pisaupedia",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
    facebook: "https://www.facebook.com/share/1Efdp5ACxr/",
    whatsapp: "6281343058848",
  },
} as const;
