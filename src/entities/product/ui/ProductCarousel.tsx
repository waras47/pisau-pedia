"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { type Product } from "@/entities/product/model/product.types";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { IconButton } from "@/shared/ui/IconButton";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "left" | "right") {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const distance = card ? card.offsetWidth + 24 : 280;
    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="scroll-rail flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-card
            className="w-[calc(50%-12px)] flex-none snap-start sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <IconButton
          label="Scroll products left"
          onClick={() => scrollByCard("left")}
          className="border border-border"
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          label="Scroll products right"
          onClick={() => scrollByCard("right")}
          className="border border-border"
        >
          <ChevronRight size={18} />
        </IconButton>
      </div>
    </div>
  );
}
