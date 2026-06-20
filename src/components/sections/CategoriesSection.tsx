import { ArrowRight } from 'lucide-react';

import { SectionHeading } from '@/components/ui';
import { CATEGORIES } from '@/data';

export function CategoriesSection() {
  return (
    <section className="bg-[#0D0D0D] py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Browse by Type"
          title="Find Your Blade"
          subtitle="From everyday chef's knives to specialist Japanese single-bevels — we have the right tool for every task."
          className="mb-12"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CATEGORIES.map((cat, index) => (
            <a
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className={`group relative overflow-hidden bg-[#111] border border-[#1E1E1E] hover:border-[#C9A84C]/40 transition-colors ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Image placeholder */}
              <div
                className={`relative bg-[#141414] flex items-center justify-center ${
                  index === 0 ? 'h-64 md:h-full min-h-[300px]' : 'h-40'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-[#333] mb-2 ${index === 0 ? 'text-7xl' : 'text-4xl'}`}
                  >
                    🔪
                  </div>
                  <p className="text-[#2A2A2A] text-xs">{cat.name}</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/5 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className={`text-white font-medium group-hover:text-[#C9A84C] transition-colors ${
                        index === 0 ? 'text-lg' : 'text-sm'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-[#666] text-xs mt-1">{cat.productCount} products</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[#444] group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all mt-0.5"
                  />
                </div>
                {index === 0 && (
                  <p className="text-[#777] text-sm mt-2 leading-relaxed">{cat.description}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
