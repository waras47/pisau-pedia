"use client";

import { useMemo, useState } from "react";

import { ProductGrid, type Product } from "@/entities/product";


export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

interface CollectionToolbarProps {
  products: Product[];
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function CollectionToolbar({ products }: CollectionToolbarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [products, activeCategory, sort]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-xs text-muted-foreground whitespace-nowrap">
            Category
          </label>
          <select
            id="category-filter"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {visibleProducts.length} products
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid products={visibleProducts} />
    </div>
  );
}
