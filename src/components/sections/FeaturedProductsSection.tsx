import { ArrowRight } from 'lucide-react';

import { ProductCard, SectionHeading } from '@/components/ui';
import { FEATURED_PRODUCTS } from '@/data';

export function FeaturedProductsSection() {
  return (
    <section className="bg-[#0A0A0A] py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured Knives"
            subtitle="Our editors' current top picks — rigorously tested, honestly reviewed."
            align="left"
          />
          <a
            href="/shop"
            className="flex items-center gap-2 text-[#C9A84C] text-sm uppercase tracking-widest hover:gap-3 transition-all whitespace-nowrap"
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
