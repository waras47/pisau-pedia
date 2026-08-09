"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { env } from "@/shared/config/env";

interface Banner {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

export function CategoryBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/category_banners`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const items = json?.data?.value as Banner[] | undefined;
        if (items?.length) setBanners(items);
      })
      .catch(() => {});
  }, []);

  if (!banners.length) return null;

  return (
    <section className="bg-surface py-16">
      <Container className="grid gap-6 sm:grid-cols-2">
        {banners.map((banner, i) => (
          <Link
            key={i}
            href={banner.href}
            className="group relative flex flex-col justify-end overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner.image} alt={banner.title} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-background">
              <h3 className="font-display text-2xl font-semibold">{banner.title}</h3>
              <p className="max-w-xs text-sm text-background/85">{banner.description}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest2">
                {banner.cta}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </Container>
    </section>
  );
}
