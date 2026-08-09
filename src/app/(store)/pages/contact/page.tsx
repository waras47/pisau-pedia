import { type Metadata } from "next";
import { MapPin, Phone, Mail, Banknote, Clock, MessageCircle } from "lucide-react";

import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";

export const metadata: Metadata = {
  title: "Hubungi Kami — Pisau Pedia",
  description:
    "Hubungi Pisau Pedia untuk pertanyaan, pesanan khusus, atau layanan perbaikan pisau.",
};

const contactInfo = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    content: "0813-4305-8848",
    href: `https://wa.me/${siteConfig.social.whatsapp}?text=Halo%20Pisau%20Pedia%2C%20saya%20mau%20tanya.`,
    description: "Chat langsung dengan tim kami",
  },
  {
    icon: Phone,
    title: "Telepon",
    content: "0813-4305-8848",
    href: "tel:+6281343058848",
    description: "Senin - Sabtu, 09:00 - 17:00 WIB",
  },
  {
    icon: Mail,
    title: "Email",
    content: "pisaupedia@gmail.com",
    href: "mailto:pisaupedia@gmail.com",
    description: "Biasanya membalas dalam 1x24 jam",
  },
];

export default function ContactPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hubungi Kami
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ada pertanyaan tentang produk, pesanan khusus, atau layanan perbaikan?
          Tim kami siap membantu.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
        {contactInfo.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center transition-colors hover:border-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <item.icon size={24} className="text-accent" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {item.title}
            </span>
            <span className="text-base font-medium text-foreground">{item.content}</span>
            <span className="text-sm text-muted-foreground">{item.description}</span>
          </a>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-8">
          <div className="mb-6 flex items-center gap-3">
            <MapPin size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Workshop</h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            Sebelah Itoe Bakery, Jln Raya Hankam, Jln Baru, Masuk Rmh No.84,
            RT.006/RW.006, Jatimurni, Pondok Melati, Bekasi, West Java 17431
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>Senin - Sabtu, 09:00 - 17:00 WIB</span>
          </div>
          <a
            href="https://maps.app.goo.gl/DhrwhjL1G37aC5f38"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            Lihat di Google Maps &rarr;
          </a>
        </div>

        <div className="rounded-lg border border-border bg-surface p-8">
          <div className="mb-6 flex items-center gap-3">
            <Banknote size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Bank Transfer</h2>
          </div>
          <div className="rounded-md bg-background p-4">
            <p className="text-sm text-muted-foreground">Bank</p>
            <p className="text-base font-medium text-foreground">Bank Mandiri</p>
            <div className="my-3 border-t border-border" />
            <p className="text-sm text-muted-foreground">Nomor Rekening</p>
            <p className="text-base font-medium text-foreground tracking-wide">1170011490331</p>
            <div className="my-3 border-t border-border" />
            <p className="text-sm text-muted-foreground">Atas Nama</p>
            <p className="text-base font-medium text-foreground">Rahmawati Nur Aida</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Konfirmasi pembayaran via WhatsApp setelah transfer.
          </p>
        </div>
      </div>
    </Container>
  );
}
