import { type Metadata } from "next";

import { About } from "@/widgets/about";

export const metadata: Metadata = {
  title: "Tentang Kami — Pisau Pedia",
  description:
    "Pisaupedia adalah produk asli Indonesia: pisau dapur berkualitas dengan material yang bisa disesuaikan, pesanan khusus perorangan & restoran, serta layanan penggantian handle, pembuatan sarung, dan perbaikan pisau.",
};

export default function AboutPage() {
  return <About />;
}
