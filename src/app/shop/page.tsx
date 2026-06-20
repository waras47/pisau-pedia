import { Filter, SlidersHorizontal } from 'lucide-react';

import { Badge, ProductCard, SectionHeading } from '@/components/ui';
import { BRANDS, CATEGORIES, PRODUCTS } from '@/data';

const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Newest'];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Page header */}
      <div className="bg-[#0D0D0D] border-b border-[#1A1A1A] px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Full Catalog"
            title="All Knives"
            subtitle={`${PRODUCTS.length} products`}
            align="left"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            {/* Sort */}
            <div className="mb-8">
              <h3 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <SlidersHorizontal size={12} />
                Sort By
              </h3>
              <ul className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt}>
                    <button className="w-full text-left text-[#888] hover:text-[#C9A84C] text-sm py-1.5 transition-colors">
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category filter */}
            <div className="mb-8">
              <h3 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <Filter size={12} />
                Category
              </h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full text-left text-[#C9A84C] text-sm py-1.5">
                    All ({PRODUCTS.length})
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button className="w-full text-left text-[#888] hover:text-[#C9A84C] text-sm py-1.5 transition-colors">
                      {cat.name} ({cat.productCount})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand filter */}
            <div className="mb-8">
              <h3 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-3">
                Brand
              </h3>
              <ul className="space-y-2">
                {BRANDS.map((brand) => (
                  <li key={brand.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      className="accent-[#C9A84C]"
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-[#888] hover:text-white text-sm cursor-pointer transition-colors"
                    >
                      {brand.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-3">
                Price Range
              </h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full bg-[#111] border border-[#2A2A2A] px-2 py-1.5 text-xs text-white placeholder:text-[#444] focus:outline-none focus:border-[#C9A84C]"
                />
                <span className="text-[#555]">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full bg-[#111] border border-[#2A2A2A] px-2 py-1.5 text-xs text-white placeholder:text-[#444] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {/* Active filters / mobile filter bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="gold">All</Badge>
                <span className="text-[#666] text-xs">{PRODUCTS.length} results</span>
              </div>
              <button className="lg:hidden flex items-center gap-2 text-[#888] text-sm border border-[#2A2A2A] px-3 py-2 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                <Filter size={14} />
                Filters
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
