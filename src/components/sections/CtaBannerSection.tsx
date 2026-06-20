import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui';

export function CtaBannerSection() {
  return (
    <section className="relative bg-[#111] py-24 px-4 lg:px-8 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #C9A84C,
              #C9A84C 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto text-center z-10">
        <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
          Limited Time
        </p>
        <h2 className="text-white text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">
          Up to 30% off
          <br />
          <span className="text-[#C9A84C]">Japanese Knives</span>
        </h2>
        <p className="text-[#888] text-base leading-relaxed mb-10 max-w-lg mx-auto">
          This week only — Shun, Miyabi, and Global at our lowest prices of the year. No code
          needed; discount applied at checkout.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary">
            Shop the Sale
          </Button>
          <Button size="lg" variant="outline">
            View All Brands <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
