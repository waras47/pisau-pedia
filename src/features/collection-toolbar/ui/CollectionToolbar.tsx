"use client";

import { useCallback, useMemo, useState } from "react";

import { ProductGrid, type Product } from "@/entities/product";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

interface CollectionToolbarProps {
  products: Product[];
  perPage?: number;
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const PER_PAGE_OPTIONS = [12, 24, 48];

export function CollectionToolbar({ products, perPage = 12 }: CollectionToolbarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(perPage);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pagedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCategoryChange = useCallback((value: string) => {
    setActiveCategory(value);
    setPage(1);
  }, []);

  const handlePerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setPage(1);
  }, []);

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
            onChange={(e) => handleCategoryChange(e.target.value)}
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
            {filteredProducts.length} produk
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / halaman</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
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

      <ProductGrid products={pagedProducts} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-30"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`rounded px-3 py-1.5 text-sm ${
                p === page
                  ? "bg-foreground text-background font-medium"
                  : "border border-border hover:bg-muted/50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
