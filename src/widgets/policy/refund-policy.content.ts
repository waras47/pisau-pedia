import type { Locale } from "@/shared/i18n/dictionaries";

import type { PolicyContent } from "./PolicyDocument";

// Isi kebijakan ini mengikuti ketentuan yang sudah dijanjikan di FAQ
// (widgets/faq/FAQ.tsx, bagian "Returns & Warranty") dan badge "Garansi 30 Hari".
// Ubah keduanya bersamaan bila kebijakan berubah.
export const refundPolicyContent: Record<Locale, PolicyContent> = {
  id: {
    title: "Kebijakan Pengembalian & Garansi",
    updated: "Terakhir diperbarui: 16 November 2026",
    intro:
      "Kami ingin Anda puas dengan setiap pisau dari Pisaupedia. Halaman ini menjelaskan cara mengembalikan produk, menukar barang yang rusak, dan cakupan garansi kami.",
    sections: [
      {
        heading: "1. Pengembalian 30 Hari",
        body: [
          "Anda dapat mengembalikan produk dalam waktu 30 hari sejak barang diterima untuk mendapatkan pengembalian dana penuh atas harga produk, tanpa perlu menyebutkan alasan.",
          "Produk harus dalam kondisi asli: belum dipakai, belum diasah ulang, tidak tergores, dan lengkap dengan kemasan serta kelengkapannya.",
          "Untuk pengembalian karena berubah pikiran, ongkos kirim pengembalian ditanggung oleh pembeli.",
        ],
      },
      {
        heading: "2. Barang Rusak, Cacat, atau Salah Kirim",
        body: [
          "Jika pisau tiba dalam keadaan rusak, cacat, atau tidak sesuai pesanan, hubungi kami lewat WhatsApp dengan foto masalahnya dan nomor pesanan Anda.",
          "Kami akan segera mengirim pengganti atau mengembalikan dana Anda. Dalam kasus ini, Anda tidak perlu menanggung ongkos kirim pengembalian.",
        ],
      },
      {
        heading: "3. Garansi Cacat Produksi",
        body: [
          "Setiap pisau dijamin terhadap cacat produksi selama Anda memilikinya.",
          "Garansi tidak mencakup:",
        ],
        list: [
          "Keausan normal akibat pemakaian sehari-hari.",
          "Mata pisau gompal atau patah karena salah penggunaan (misalnya memotong tulang keras, benda beku, atau dipakai di talenan kaca/keramik).",
          "Karat akibat perawatan yang tidak sesuai, terutama pada pisau baja karbon.",
        ],
      },
      {
        heading: "4. Cara Mengajukan Pengembalian",
        body: ["Ikuti langkah berikut:"],
        list: [
          "Hubungi kami lewat WhatsApp 0855-9991-117 atau email pisaupedia@gmail.com dengan nomor pesanan dan alasan pengembalian (sertakan foto bila barang rusak).",
          "Kami akan mengirim instruksi dan alamat pengembalian.",
          "Kemas produk dengan aman, sebaiknya dalam kemasan aslinya, lalu kirim ke alamat yang kami berikan.",
          "Setelah barang kami terima dan periksa, dana dikembalikan ke rekening Anda atau barang pengganti kami kirimkan.",
        ],
      },
      {
        heading: "5. Pembatalan Pesanan",
        body: [
          "Hubungi kami lewat WhatsApp secepatnya. Pesanan biasanya masih bisa diubah atau dibatalkan selama belum dikirim. Jika paket sudah dalam perjalanan, silakan tunggu hingga diterima lalu ajukan pengembalian sesuai kebijakan ini.",
        ],
      },
      {
        heading: "6. Kontak",
        body: ["Untuk pertanyaan tentang pengembalian atau garansi, hubungi kami di:"],
        list: [
          "WhatsApp: 0855-9991-117",
          "Email: pisaupedia@gmail.com",
          "Alamat: Jl Baru No 84 RT 06 RW 06, Jl Raya Hankam, Jati Murni, Pondok Melati, Kota Bekasi, Jawa Barat 17431",
        ],
      },
    ],
  },
  en: {
    title: "Refund & Warranty Policy",
    updated: "Last updated: November 16, 2026",
    intro:
      "We want you to be happy with every Pisaupedia knife. This page explains how to return a product, replace an item that arrived damaged, and what our warranty covers.",
    sections: [
      {
        heading: "1. 30-Day Returns",
        body: [
          "You can return a product within 30 days of delivery for a full refund of the product price, no questions asked.",
          "The product must be in its original condition: unused, not resharpened, unscratched, and complete with its packaging and accessories.",
          "For change-of-mind returns, return shipping is paid by the customer.",
        ],
      },
      {
        heading: "2. Damaged, Faulty, or Wrong Items",
        body: [
          "If your knife arrives damaged, faulty, or not as ordered, contact us on WhatsApp with a photo of the issue and your order number.",
          "We will arrange a replacement or refund right away. In this case you won't need to cover return shipping.",
        ],
      },
      {
        heading: "3. Manufacturing Defect Warranty",
        body: ["Every knife is covered against manufacturing defects for as long as you own it.", "The warranty does not cover:"],
        list: [
          "Normal wear from everyday use.",
          "Chips or breaks caused by misuse (for example cutting hard bones or frozen food, or using glass/ceramic cutting boards).",
          "Rust caused by improper care, especially on carbon steel knives.",
        ],
      },
      {
        heading: "4. How to Request a Return",
        body: ["Follow these steps:"],
        list: [
          "Contact us on WhatsApp at +62 855-9991-117 or email pisaupedia@gmail.com with your order number and the reason for the return (include photos if the item is damaged).",
          "We will send you instructions and the return address.",
          "Pack the product securely, ideally in its original packaging, and ship it to the address we provide.",
          "Once we have received and inspected the item, we will refund you or ship your replacement.",
        ],
      },
      {
        heading: "5. Order Cancellation",
        body: [
          "Message us on WhatsApp as soon as possible. We can usually change or cancel an order before it ships. Once it is on its way, please wait for delivery and request a return under this policy.",
        ],
      },
      {
        heading: "6. Contact",
        body: ["For questions about returns or the warranty, contact us at:"],
        list: [
          "WhatsApp: +62 855-9991-117",
          "Email: pisaupedia@gmail.com",
          "Address: Jl Baru No 84 RT 06 RW 06, Jl Raya Hankam, Jati Murni, Pondok Melati, Kota Bekasi, West Java 17431, Indonesia",
        ],
      },
    ],
  },
};
