"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/products/aoi-gyuto-210.jpg", alt: "Aoi Gyuto 210mm — hand-forged chef's knife" },
  { src: "/images/products/yama-gyuto-240.jpg", alt: "Yama Gyuto 240mm — hand-forged chef's knife" },
  { src: "/images/products/sumi-santoku-180.jpg", alt: "Sumi Santoku 180mm" },
  { src: "/images/products/kuro-bunka-190.jpg", alt: "Kuro Bunka 190mm — Damascus steel" },
  { src: "/images/products/tsuchime-nakiri-165.jpg", alt: "Tsuchime Nakiri 165mm" },
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
