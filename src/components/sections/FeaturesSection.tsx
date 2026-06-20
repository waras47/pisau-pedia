import { Award, RefreshCw, Shield, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Award,
    title: 'Expert Curation',
    description:
      'Every knife passes a hands-on evaluation by our team of chefs and knife enthusiasts before it earns a place in our catalog.',
  },
  {
    icon: Truck,
    title: 'Free Shipping $150+',
    description:
      'Secure, insured shipping on all orders over $150. Orders typically leave our warehouse within 24 hours.',
  },
  {
    icon: Shield,
    title: 'Authenticity Guaranteed',
    description:
      "We source directly from manufacturers and authorized distributors. You'll never receive a counterfeit.",
  },
  {
    icon: RefreshCw,
    title: '60-Day Returns',
    description:
      "Not the right knife? Return it within 60 days in its original condition for a full refund — no questions asked.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[#0D0D0D] py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Gold divider line */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-[#1E1E1E]" />
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] px-4">
            Why Sharp Edge
          </span>
          <div className="flex-1 h-px bg-[#1E1E1E]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-4">
              <div className="w-10 h-10 border border-[#C9A84C]/40 flex items-center justify-center">
                <Icon size={18} className="text-[#C9A84C]" />
              </div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider">{title}</h3>
              <p className="text-[#666] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
