import { ArrowRight, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] flex items-center overflow-hidden">
      {/* Background texture / gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent z-10" />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #C9A84C,
            #C9A84C 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />

      {/* Right side — hero image placeholder */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#111] hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[180px] leading-none opacity-20">🔪</div>
            <p className="text-[#333] text-sm mt-4">Hero product image</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 w-full pt-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em]">
              Premium Cutlery
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight mb-6">
            Where Steel
            <br />
            Meets{' '}
            <em className="not-italic text-[#C9A84C] font-light">Precision</em>
          </h1>

          {/* Subhead */}
          <p className="text-[#999] text-lg leading-relaxed mb-10 max-w-lg">
            Handpicked from the world&apos;s finest bladesmiths — Shun, Wüsthof, Miyabi, and more.
            Every knife on this shelf earns its place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="primary">
              Shop All Knives
            </Button>
            <Button size="lg" variant="ghost" className="flex items-center gap-2">
              Explore Brands <ArrowRight size={16} />
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 sm:gap-10">
            {[
              { stat: '500+', label: 'Curated Knives' },
              { stat: '30+', label: 'Premium Brands' },
              { stat: '50k+', label: 'Happy Cooks' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-white text-2xl font-light">{stat}</p>
                <p className="text-[#666] text-xs uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#555]">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
