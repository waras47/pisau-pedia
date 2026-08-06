"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        href: "/pisaupedia/admin",
        icon: <DashboardIcon />,
      },
    ],
  },
  {
    title: "Order Management",
    items: [
      {
        label: "Orders",
        href: "/pisaupedia/admin/orders",
        icon: <OrderIcon />,
        children: [
          { label: "All Orders", href: "/pisaupedia/admin/orders" },
          { label: "Pending", href: "/pisaupedia/admin/orders?status=pending" },
          { label: "Processing", href: "/pisaupedia/admin/orders?status=processing" },
          { label: "Delivered", href: "/pisaupedia/admin/orders?status=delivered" },
        ],
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        label: "Produk",
        href: "/pisaupedia/admin/products",
        icon: <ProductIcon />,
      },
      {
        label: "Kategori",
        href: "/pisaupedia/admin/categories",
        icon: <CategoryIcon />,
      },
      {
        label: "Koleksi",
        href: "/pisaupedia/admin/collections",
        icon: <CategoryIcon />,
      },
      {
        label: "Configurator",
        href: "/pisaupedia/admin/configurator",
        icon: <ProductIcon />,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        label: "Sharpening",
        href: "/pisaupedia/admin/sharpening",
        icon: <SharpeningIcon />,
        children: [
          { label: "Requests", href: "/pisaupedia/admin/sharpening" },
          { label: "In Progress", href: "/pisaupedia/admin/sharpening?status=in_progress" },
          { label: "Completed", href: "/pisaupedia/admin/sharpening?status=completed" },
        ],
      },
      {
        label: "Engravings",
        href: "/pisaupedia/admin/engravings",
        icon: <EngravingIcon />,
        children: [
          { label: "Orders", href: "/pisaupedia/admin/engravings" },
          { label: "Pending Approval", href: "/pisaupedia/admin/engravings?status=pending" },
        ],
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        label: "Customers",
        href: "/pisaupedia/admin/customers",
        icon: <CustomerIcon />,
      },
      {
        label: "Reviews",
        href: "/pisaupedia/admin/reviews",
        icon: <ReviewIcon />,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        label: "Coupons",
        href: "/pisaupedia/admin/coupons",
        icon: <CouponIcon />,
      },
      {
        label: "Newsletter",
        href: "/pisaupedia/admin/newsletter",
        icon: <NewsletterIcon />,
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        label: "Sales Report",
        href: "/pisaupedia/admin/reports/sales",
        icon: <ReportIcon />,
      },
      {
        label: "Inventory Report",
        href: "/pisaupedia/admin/reports/inventory",
        icon: <InventoryReportIcon />,
      },
    ],
  },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#1a1d29] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="rounded bg-white px-2 py-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pisaupedia.png" alt="Pisau Pedia" className="h-6 w-auto" />
        </div>
        <span className="ml-auto text-xs text-white/40 lg:block">Admin</span>
        {onClose && (
          <button type="button" onClick={onClose} className="ml-2 rounded p-1 text-white/40 hover:bg-white/10 hover:text-white lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navSections.map((section) => (
          <div key={section.title} className="mt-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.children?.some((c) => pathname === c.href) ?? false);
              const isOpen = openMenus[item.label] ?? false;

              return (
                <div key={item.label}>
                  {item.children ? (
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90"
                      }`}
                    >
                      <span className="w-5 shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronIcon open={isOpen} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90"
                      }`}
                    >
                      <span className="w-5 shrink-0">{item.icon}</span>
                      {item.label}
                    </Link>
                  )}

                  {item.children && isOpen && (
                    <div className="ml-8 mt-1 flex flex-col gap-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                            pathname === child.href
                              ? "text-emerald-400"
                              : "text-white/40 hover:text-white/70"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// --- SVG Icons ---

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><path d="m17 13 5 5m0-5-5 5" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}
function CategoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />
    </svg>
  );
}
function SharpeningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" />
    </svg>
  );
}
function EngravingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
function CustomerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ReviewIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function CouponIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  );
}
function NewsletterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
function InventoryReportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 18v-4" /><path d="M14 18v-6" />
    </svg>
  );
}
