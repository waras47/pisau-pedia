"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/dev-images/products/aoi-gyuto-210.jpg", alt: "Aoi Gyuto 210mm — hand-forged chef's knife" },
  { src: "/dev-images/products/yama-gyuto-240.jpg", alt: "Yama Gyuto 240mm — hand-forged chef's knife" },
  { src: "/dev-images/products/sumi-santoku-180.jpg", alt: "Sumi Santoku 180mm" },
  { src: "/dev-images/products/kuro-bunka-190.jpg", alt: "Kuro Bunka 190mm — Damascus steel" },
  { src: "/dev-images/products/tsuchime-nakiri-165.jpg", alt: "Tsuchime Nakiri 165mm" },
];

export function HeroImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clip-blade-br relative aspect-[15/8] w-full overflow-hidden bg-muted shadow-2xl shadow-foreground/20 ring-1 ring-gold/40 ring-offset-4 ring-offset-surface">
      {slides.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute bottom-5 left-5 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full bg-background transition-all ${
              i === index ? "w-6 opacity-100" : "w-1.5 opacity-50 hover:opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
