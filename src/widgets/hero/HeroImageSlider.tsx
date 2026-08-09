"use client";

import { useEffect, useState } from "react";

import { env } from "@/shared/config/env";

interface Slide {
  src: string;
  alt: string;
}

export function HeroImageSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/hero_slides`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const items = json?.data?.value as Array<{ image: string; alt: string }> | undefined;
        if (items?.length) setSlides(items.map((s) => ({ src: s.image, alt: s.alt })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {slides.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Darkening wash so studio-white product photography reads as a moody black backdrop */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:left-6 sm:translate-x-0">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full bg-white transition-all ${
              i === index ? "w-6 opacity-100" : "w-1.5 opacity-50 hover:opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
