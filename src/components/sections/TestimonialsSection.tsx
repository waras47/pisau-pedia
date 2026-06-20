import { Quote } from 'lucide-react';

import { SectionHeading, StarRating } from '@/components/ui';
import { TESTIMONIALS } from '@/data';

export function TestimonialsSection() {
  return (
    <section className="bg-[#0A0A0A] py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="From the Community"
          title="Trusted by Cooks Who Know"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#0D0D0D] border border-[#1E1E1E] p-8 flex flex-col gap-5"
            >
              <Quote size={24} className="text-[#C9A84C]/40" />
              <StarRating rating={t.rating} size="md" />
              <blockquote className="text-[#CCC] text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1A1A1A]">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] text-xs font-bold">
                    {t.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.author}</p>
                  <p className="text-[#666] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
