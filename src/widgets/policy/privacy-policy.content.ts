import type { Locale } from "@/shared/i18n/dictionaries";
import type { PolicyContent } from "./PolicyDocument";

export const privacyPolicyContent: Record<Locale, PolicyContent> = {
  id: {
    title: "Kebijakan Privasi",
    updated: "Terakhir diperbarui: 25 Agustus 2026",
    intro:
      'Pisaupedia ("kami") mengelola website www.pisaupedia.com. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan website kami. Dengan menggunakan website ini, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini.',
    sections: [
      {
        heading: "1. Informasi yang Kami Kumpulkan",
        body: ["Kami dapat mengumpulkan jenis informasi berikut:"],
        list: [
          "Informasi yang Anda berikan langsung: seperti nama, alamat email, atau pesan saat Anda menghubungi kami, mengisi formulir, atau meninggalkan komentar/ulasan.",
          "Informasi otomatis: seperti alamat IP, jenis perangkat, jenis browser, halaman yang dikunjungi, dan waktu kunjungan, yang dikumpulkan melalui cookies dan teknologi serupa.",
        ],
      },
      {
        heading: "2. Cara Kami Menggunakan Informasi",
        body: ["Kami menggunakan informasi yang dikumpulkan untuk:"],
        list: [
          "Menyediakan, mengoperasikan, dan memelihara website.",
          "Meningkatkan konten dan pengalaman pengguna.",
          "Menanggapi pertanyaan atau permintaan Anda.",
          "Menganalisis penggunaan website (mis. melalui layanan analitik).",
          "Mematuhi kewajiban hukum yang berlaku.",
        ],
      },
      {
        heading: "3. Cookies",
        body: [
          "Website ini menggunakan cookies untuk meningkatkan fungsionalitas dan menganalisis lalu lintas.",
          "Anda dapat menonaktifkan cookies melalui pengaturan browser Anda, namun beberapa fitur website mungkin tidak berfungsi dengan baik.",
        ],
      },
      {
        heading: "4. Layanan Pihak Ketiga",
        body: [
          "Kami dapat menggunakan layanan pihak ketiga (seperti Google Analytics, platform media sosial seperti TikTok, atau penyedia layanan lainnya) yang dapat mengumpulkan informasi sesuai kebijakan privasi masing-masing.",
          "Website ini dapat memuat tautan ke situs pihak ketiga; kami tidak bertanggung jawab atas praktik privasi situs tersebut.",
        ],
      },
      {
        heading: "5. Berbagi Informasi",
        body: [
          "Kami tidak menjual informasi pribadi Anda.",
          "Kami hanya membagikan informasi kepada pihak ketiga bila diperlukan untuk mengoperasikan layanan, mematuhi hukum, atau melindungi hak kami.",
        ],
      },
      {
        heading: "6. Keamanan Data",
        body: [
          "Kami menerapkan langkah-langkah yang wajar untuk melindungi informasi Anda. Namun, tidak ada metode transmisi melalui internet yang sepenuhnya aman, sehingga kami tidak dapat menjamin keamanan mutlak.",
        ],
      },
      {
        heading: "7. Hak Anda",
        body: [
          "Anda berhak meminta akses, koreksi, atau penghapusan data pribadi Anda yang kami simpan, dengan menghubungi kami melalui kontak di bawah.",
        ],
      },
      {
        heading: "8. Privasi Anak",
        body: [
          "Website ini tidak ditujukan untuk anak di bawah usia 13 tahun, dan kami tidak dengan sengaja mengumpulkan data dari anak-anak.",
        ],
      },
      {
        heading: "9. Perubahan Kebijakan Privasi",
        body: [
          "Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan di halaman ini.",
        ],
      },
      {
        heading: "10. Kontak",
        body: ["Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami di:"],
        list: ["Email: pisaupedia@gmail.com", "Website: www.pisaupedia.com"],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: August 25, 2026",
    intro:
      'Pisaupedia ("we," "us," or "our") operates the website www.pisaupedia.com. This page explains how we collect, use, and protect your information when you use our website. By using this website, you agree to the practices described in this Privacy Policy.',
    sections: [
      {
        heading: "1. Information We Collect",
        body: ["We may collect the following types of information:"],
        list: [
          "Information you provide directly: such as your name, email address, or messages when you contact us, fill out a form, or leave a comment/review.",
          "Automatically collected information: such as IP address, device type, browser type, pages visited, and time of visit, collected through cookies and similar technologies.",
        ],
      },
      {
        heading: "2. How We Use Information",
        body: ["We use the information we collect to:"],
        list: [
          "Provide, operate, and maintain the website.",
          "Improve our content and user experience.",
          "Respond to your questions or requests.",
          "Analyze website usage (e.g. through analytics services).",
          "Comply with applicable legal obligations.",
        ],
      },
      {
        heading: "3. Cookies",
        body: [
          "This website uses cookies to improve functionality and analyze traffic.",
          "You can disable cookies through your browser settings, but some website features may not work properly as a result.",
        ],
      },
      {
        heading: "4. Third-Party Services",
        body: [
          "We may use third-party services (such as Google Analytics, social media platforms like TikTok, or other service providers) that may collect information in accordance with their own privacy policies.",
          "This website may contain links to third-party sites; we are not responsible for the privacy practices of those sites.",
        ],
      },
      {
        heading: "5. Sharing of Information",
        body: [
          "We do not sell your personal information.",
          "We only share information with third parties when necessary to operate our services, comply with the law, or protect our rights.",
        ],
      },
      {
        heading: "6. Data Security",
        body: [
          "We implement reasonable measures to protect your information. However, no method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "7. Your Rights",
        body: [
          "You have the right to request access to, correction of, or deletion of the personal data we hold about you by contacting us using the details below.",
        ],
      },
      {
        heading: "8. Children's Privacy",
        body: [
          "This website is not directed at children under the age of 13, and we do not knowingly collect data from children.",
        ],
      },
      {
        heading: "9. Changes to This Privacy Policy",
        body: [
          "We may update this Privacy Policy from time to time. Changes take effect as soon as they are published on this page.",
        ],
      },
      {
        heading: "10. Contact",
        body: ["If you have any questions about this Privacy Policy, please contact us at:"],
        list: ["Email: pisaupedia@gmail.com", "Website: www.pisaupedia.com"],
      },
    ],
  },
};
