import type { Locale } from "@/shared/i18n/dictionaries";
import type { PolicyContent } from "./PolicyDocument";

export const termsOfServiceContent: Record<Locale, PolicyContent> = {
  id: {
    title: "Syarat dan Ketentuan",
    updated: "Terakhir diperbarui: 25 Agustus 2026",
    intro:
      'Selamat datang di Pisaupedia (www.pisaupedia.com). Dengan mengakses dan menggunakan website ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di bawah ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan website ini.',
    sections: [
      {
        heading: "1. Definisi",
        body: [
          '"Kami" merujuk pada Pisaupedia, pengelola website www.pisaupedia.com.',
          '"Anda" atau "Pengguna" merujuk pada setiap orang yang mengakses atau menggunakan website ini.',
          '"Layanan" merujuk pada seluruh konten, informasi, produk, dan fitur yang tersedia di website.',
        ],
      },
      {
        heading: "2. Penggunaan Layanan",
        body: [
          "Anda setuju untuk menggunakan website ini hanya untuk tujuan yang sah dan sesuai hukum yang berlaku.",
          "Anda tidak diperbolehkan menyalahgunakan, merusak, atau mengganggu keamanan dan kinerja website.",
          "Anda dilarang menggunakan konten website untuk tujuan melanggar hukum atau merugikan pihak lain.",
        ],
      },
      {
        heading: "3. Konten dan Hak Kekayaan Intelektual",
        body: [
          "Seluruh konten di website ini (teks, gambar, logo, artikel, ulasan, dan materi lainnya) merupakan milik Pisaupedia atau pemberi lisensinya dan dilindungi oleh hukum hak cipta.",
          "Anda tidak diperbolehkan menyalin, mendistribusikan, atau menggunakan kembali konten kami untuk tujuan komersial tanpa izin tertulis dari kami.",
        ],
      },
      {
        heading: "4. Informasi Produk",
        body: [
          "Website ini menyediakan informasi, ulasan, dan/atau referensi terkait pisau dan produk terkait.",
          "Kami berupaya menyajikan informasi seakurat mungkin, namun kami tidak menjamin bahwa seluruh informasi selalu lengkap, terkini, atau bebas dari kesalahan.",
          "Segala keputusan yang Anda ambil berdasarkan informasi di website ini menjadi tanggung jawab Anda sendiri.",
        ],
      },
      {
        heading: "5. Konten Pihak Ketiga dan Tautan Eksternal",
        body: [
          "Website ini dapat memuat tautan ke situs pihak ketiga. Kami tidak bertanggung jawab atas isi, kebijakan, atau praktik situs pihak ketiga tersebut.",
        ],
      },
      {
        heading: "6. Konten yang Dikirim Pengguna",
        body: [
          "Dengan mengirimkan konten (komentar, ulasan, dsb.), Anda memberikan kami izin untuk menampilkan dan menggunakan konten tersebut di website.",
          "Anda bertanggung jawab penuh atas konten yang Anda kirimkan dan menjamin konten tersebut tidak melanggar hak pihak lain.",
        ],
      },
      {
        heading: "7. Batasan Tanggung Jawab",
        body: [
          'Website dan seluruh layanannya disediakan "sebagaimana adanya" (as is) tanpa jaminan apa pun.',
          "Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan website ini.",
        ],
      },
      {
        heading: "8. Penggunaan API dan Integrasi Pihak Ketiga",
        body: [
          "Website ini dapat terhubung dengan layanan pihak ketiga (misalnya platform media sosial seperti TikTok). Penggunaan layanan tersebut juga tunduk pada syarat dan ketentuan masing-masing penyedia.",
        ],
      },
      {
        heading: "9. Perubahan Syarat dan Ketentuan",
        body: [
          "Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan di halaman ini. Anda disarankan meninjau halaman ini secara berkala.",
        ],
      },
      {
        heading: "10. Penghentian Akses",
        body: [
          "Kami berhak membatasi atau menghentikan akses Anda ke website apabila Anda melanggar syarat dan ketentuan ini.",
        ],
      },
      {
        heading: "11. Hukum yang Berlaku",
        body: [
          "Syarat dan ketentuan ini diatur dan ditafsirkan berdasarkan hukum yang berlaku di Republik Indonesia.",
        ],
      },
      {
        heading: "12. Kontak",
        body: ["Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami di:"],
        list: ["Email: pisaupedia@gmail.com", "Website: www.pisaupedia.com"],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: August 25, 2026",
    intro:
      'Welcome to Pisaupedia (www.pisaupedia.com). By accessing and using this website, you are deemed to have read, understood, and agreed to all the terms and conditions below. If you do not agree, please do not use this website.',
    sections: [
      {
        heading: "1. Definitions",
        body: [
          '"We" refers to Pisaupedia, the operator of the website www.pisaupedia.com.',
          '"You" or "User" refers to any person who accesses or uses this website.',
          '"Service" refers to all content, information, products, and features available on the website.',
        ],
      },
      {
        heading: "2. Use of the Service",
        body: [
          "You agree to use this website only for lawful purposes and in accordance with applicable law.",
          "You may not misuse, damage, or interfere with the security or performance of the website.",
          "You may not use the website's content for any unlawful purpose or to harm others.",
        ],
      },
      {
        heading: "3. Content and Intellectual Property Rights",
        body: [
          "All content on this website (text, images, logos, articles, reviews, and other materials) is owned by Pisaupedia or its licensors and is protected by copyright law.",
          "You may not copy, distribute, or reuse our content for commercial purposes without our written permission.",
        ],
      },
      {
        heading: "4. Product Information",
        body: [
          "This website provides information, reviews, and/or references related to knives and related products.",
          "We strive to present information as accurately as possible, but we do not guarantee that all information is always complete, up to date, or free of errors.",
          "Any decisions you make based on information on this website are your own responsibility.",
        ],
      },
      {
        heading: "5. Third-Party Content and External Links",
        body: [
          "This website may contain links to third-party sites. We are not responsible for the content, policies, or practices of those third-party sites.",
        ],
      },
      {
        heading: "6. User-Submitted Content",
        body: [
          "By submitting content (comments, reviews, etc.), you grant us permission to display and use that content on the website.",
          "You are fully responsible for the content you submit and warrant that it does not infringe on the rights of others.",
        ],
      },
      {
        heading: "7. Limitation of Liability",
        body: [
          'The website and all its services are provided "as is" without any warranty of any kind.',
          "We are not liable for any direct or indirect losses arising from your use of, or inability to use, this website.",
        ],
      },
      {
        heading: "8. Use of APIs and Third-Party Integrations",
        body: [
          "This website may connect with third-party services (such as social media platforms like TikTok). Use of those services is also subject to each provider's own terms and conditions.",
        ],
      },
      {
        heading: "9. Changes to These Terms",
        body: [
          "We reserve the right to change these Terms of Service at any time. Changes take effect as soon as they are published on this page. We recommend reviewing this page periodically.",
        ],
      },
      {
        heading: "10. Termination of Access",
        body: [
          "We reserve the right to restrict or terminate your access to the website if you violate these Terms of Service.",
        ],
      },
      {
        heading: "11. Governing Law",
        body: [
          "These Terms of Service are governed by and construed in accordance with the laws of the Republic of Indonesia.",
        ],
      },
      {
        heading: "12. Contact",
        body: ["If you have any questions about these Terms of Service, please contact us at:"],
        list: ["Email: pisaupedia@gmail.com", "Website: www.pisaupedia.com"],
      },
    ],
  },
};
