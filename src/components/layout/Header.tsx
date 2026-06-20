'use client';

import { useState } from 'react';

import { ChevronDown, Menu, Search, ShoppingCart, User, X } from 'lucide-react';

import { NAV_ITEMS } from '@/data';

interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar */}
      <div className="bg-[#C9A84C] text-[#0A0A0A] text-center py-2 px-4 text-xs font-medium tracking-wider uppercase">
        Free shipping on orders over $150 · Use code SHARP10 for 10% off
      </div>

      {/* Main nav */}
      <nav className="bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-[#C9A84C] font-bold text-xl tracking-tight">
                SHARP<span className="text-white font-light">EDGE</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-[#CCC] hover:text-white text-sm uppercase tracking-widest transition-colors py-5"
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className="text-[#888]" />}
                  </a>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 w-52 bg-[#111] border border-[#222] shadow-xl py-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-[#AAA] hover:text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                className="text-[#AAA] hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                className="text-[#AAA] hover:text-white transition-colors hidden md:block"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              <button
                className="text-[#AAA] hover:text-white transition-colors relative"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-[#AAA] hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0F0F0F] border-t border-[#1E1E1E] px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="block py-3 text-[#CCC] uppercase tracking-widest text-sm border-b border-[#1E1E1E]"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm text-[#888] hover:text-[#C9A84C]"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
