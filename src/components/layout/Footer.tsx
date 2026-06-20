import { Globe, Rss, Share2, Video } from 'lucide-react';

const FOOTER_LINKS = {
  Shop: [
    { label: "Chef's Knives", href: '/shop/chef-knives' },
    { label: 'Santoku', href: '/shop/santoku-knives' },
    { label: 'Bread Knives', href: '/shop/bread-knives' },
    { label: 'Paring Knives', href: '/shop/paring-knives' },
    { label: 'Sale', href: '/shop/sale' },
  ],
  Brands: [
    { label: 'Shun', href: '/brands/shun' },
    { label: 'Wüsthof', href: '/brands/wusthof' },
    { label: 'Miyabi', href: '/brands/miyabi' },
    { label: 'Global', href: '/brands/global' },
    { label: 'Zwilling', href: '/brands/zwilling' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Knife Care Guide', href: '/knife-care' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Warranty', href: '/warranty' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1A1A1A]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <span className="text-[#C9A84C] font-bold text-lg tracking-tight">
                SHARP<span className="text-white font-light">EDGE</span>
              </span>
            </a>
            <p className="text-[#666] text-sm leading-relaxed mb-6">
              Premium cutlery from the world&apos;s finest bladesmiths. Every knife, a commitment
              to craft.
            </p>
            <div className="flex items-center gap-4">
              {[Share2, Globe, Rss, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[#555] hover:text-[#C9A84C] transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#666] hover:text-[#C9A84C] text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
          <div className="max-w-md">
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-2">
              Join the Edge
            </h4>
            <p className="text-[#666] text-sm mb-4">
              New arrivals, blade guides, and exclusive offers. No spam, ever.
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#111] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
              <button className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#B8963E] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#111] px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[#444] text-xs">
          <p>© {new Date().getFullYear()} SharpEdge Shop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
              <span key={method} className="text-[#555]">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
