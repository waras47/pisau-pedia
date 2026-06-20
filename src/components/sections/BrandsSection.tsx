import { SectionHeading } from '@/components/ui';
import { BRANDS } from '@/data';

export function BrandsSection() {
  return (
    <section className="bg-[#080808] py-16 px-4 lg:px-8 border-y border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="World-Class Makers"
          title="Brands We Carry"
          subtitle="We partner only with bladesmiths whose quality meets our standard — no compromises."
          className="mb-12"
        />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-[#1A1A1A]">
          {BRANDS.map((brand) => (
            <a
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group bg-[#080808] flex flex-col items-center justify-center gap-3 py-8 px-4 hover:bg-[#111] transition-colors"
            >
              {/* Brand logo placeholder */}
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#C9A84C]/10 transition-colors">
                <span className="text-[#C9A84C] text-xs font-bold">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium group-hover:text-[#C9A84C] transition-colors">
                  {brand.name}
                </p>
                <p className="text-[#555] text-xs mt-0.5">{brand.country}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
