"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead,
  type NotificationApiItem,
  type NotificationModule,
} from "@/entities/notification/api/notification.api";
import { globalSearch, type GlobalSearchResult } from "@/entities/search/api/search.api";

import { useAuth } from "@/features/auth/model/AuthProvider";

const NOTIFICATION_POLL_MS = 30000;
const SEARCH_DEBOUNCE_MS = 300;

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const moduleIcons: Record<NotificationModule, string> = {
  order: "📦",
  service: "🔧",
  customer: "👤",
  product: "🔪",
};

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<GlobalSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationApiItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchInput(value: string) {
    setSearchQuery(value);
    setSearchDropdownOpen(true);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!value.trim()) {
      setSearchResult(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    searchDebounceRef.current = setTimeout(() => {
      globalSearch(value)
        .then(setSearchResult)
        .catch(() => setSearchResult(null))
        .finally(() => setSearchLoading(false));
    }, SEARCH_DEBOUNCE_MS);
  }

  function goToProducts() {
    setSearchDropdownOpen(false);
    router.push(`/admin/products?q=${encodeURIComponent(searchQuery)}`);
  }
  function goToCustomers() {
    setSearchDropdownOpen(false);
    router.push(`/admin/customers?q=${encodeURIComponent(searchQuery)}`);
  }
  function goToOrders() {
    setSearchDropdownOpen(false);
    router.push(`/admin/orders?q=${encodeURIComponent(searchQuery)}`);
  }

  const searchProducts = searchResult?.products ?? [];
  const searchCustomers = searchResult?.customers ?? [];
  const searchOrders = searchResult?.orders ?? [];
  const hasSearchResults = Boolean(searchProducts.length || searchCustomers.length || searchOrders.length);

  async function refreshUnreadCount() {
    try {
      const { count } = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Polling failures shouldn't disrupt the rest of the admin panel.
    }
  }

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, NOTIFICATION_POLL_MS);
    return () => clearInterval(interval);
  }, []);

  async function toggleNotifications() {
    const opening = !notifOpen;
    setNotifOpen(opening);
    if (opening) {
      setNotifLoading(true);
      try {
        const { items } = await listNotifications({ perPage: 10 });
        setNotifications(items);
      } catch {
        // Keep the dropdown open even if the list fails to load.
      } finally {
        setNotifLoading(false);
      }
    }
  }

  async function handleNotificationClick(n: NotificationApiItem) {
    setNotifOpen(false);
    if (!n.is_read) {
      setUnreadCount((c) => Math.max(0, c - 1));
      markAsRead(n.id).catch(() => {});
    }
    if (n.link) router.push(n.link);
  }

  async function handleMarkAllAsRead() {
    setNotifications((items) => items.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllAsRead();
    } catch {
      // Best-effort — next poll will reconcile the true count.
    }
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/admin/login");
  }

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:h-16 sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari produk, customer, pesanan..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery.trim() && setSearchDropdownOpen(true)}
              className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 md:w-64"
            />
          </div>

          {searchDropdownOpen && searchQuery.trim() && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSearchDropdownOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg">
                <SearchResultsPanel
                  loading={searchLoading}
                  hasResults={hasSearchResults}
                  query={searchQuery}
                  products={searchProducts}
                  customers={searchCustomers}
                  orders={searchOrders}
                  onGoToProducts={goToProducts}
                  onGoToCustomers={goToCustomers}
                  onGoToOrders={goToOrders}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search button */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen((o) => !o)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:hidden"
        >
          <SearchIcon />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg sm:w-96">
                <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                  <p className="text-sm font-semibold text-gray-800">Notifikasi</p>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-medium text-emerald-500 hover:underline"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifLoading ? (
                    <p className="px-3 py-8 text-center text-sm text-gray-400">Memuat...</p>
                  ) : notifications.length === 0 ? (
                    <p className="px-3 py-8 text-center text-sm text-gray-400">Belum ada notifikasi.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotificationClick(n)}
                        className={`flex w-full items-start gap-2.5 border-b border-gray-50 px-3 py-2.5 text-left text-sm hover:bg-gray-50 ${
                          n.is_read ? "" : "bg-emerald-50/40"
                        }`}
                      >
                        <span className="mt-0.5 text-base">{moduleIcons[n.module] ?? "🔔"}</span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-800">{n.title}</span>
                            {!n.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
                          </span>
                          <span className="block truncate text-xs text-gray-500">{n.message}</span>
                          <span className="text-[10px] text-gray-400">{formatRelativeTime(n.created_at)}</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1 sm:gap-3 sm:hover:bg-gray-50"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.full_name ?? "Admin"}</p>
              <p className="text-[11px] capitalize text-gray-400">{user?.role ?? ""}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 sm:h-9 sm:w-9 sm:text-sm">
              {(user?.full_name?.[0] ?? "A").toUpperCase()}
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-3 py-2 sm:hidden">
                  <p className="text-sm font-medium text-gray-800">{user?.full_name ?? "Admin"}</p>
                  <p className="text-[11px] capitalize text-gray-400">{user?.role ?? ""}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-full z-20 border-b border-gray-200 bg-white p-3 shadow-lg sm:hidden">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <SearchIcon />
            <input
              type="text"
              autoFocus
              placeholder="Cari produk, customer, pesanan..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          {searchQuery.trim() && (
            <div className="mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
              <SearchResultsPanel
                loading={searchLoading}
                hasResults={hasSearchResults}
                query={searchQuery}
                products={searchProducts}
                customers={searchCustomers}
                orders={searchOrders}
                onGoToProducts={() => { setMobileSearchOpen(false); goToProducts(); }}
                onGoToCustomers={() => { setMobileSearchOpen(false); goToCustomers(); }}
                onGoToOrders={() => { setMobileSearchOpen(false); goToOrders(); }}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

interface SearchResultsPanelProps {
  loading: boolean;
  hasResults: boolean;
  query: string;
  products: GlobalSearchResult["products"];
  customers: GlobalSearchResult["customers"];
  orders: GlobalSearchResult["orders"];
  onGoToProducts: () => void;
  onGoToCustomers: () => void;
  onGoToOrders: () => void;
}

// Shared between the desktop dropdown and the mobile full-width overlay —
// same result list, different containers around it.
function SearchResultsPanel({
  loading,
  hasResults,
  query,
  products,
  customers,
  orders,
  onGoToProducts,
  onGoToCustomers,
  onGoToOrders,
}: SearchResultsPanelProps) {
  if (loading) {
    return <p className="px-3 py-8 text-center text-sm text-gray-400">Mencari...</p>;
  }
  if (!hasResults) {
    return (
      <p className="px-3 py-8 text-center text-sm text-gray-400">
        Tidak ada hasil untuk &quot;{query}&quot;.
      </p>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto py-1">
      {products.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <p className="text-xs font-semibold uppercase text-gray-400">Produk</p>
            <button type="button" onClick={onGoToProducts} className="text-xs text-emerald-500 hover:underline">
              Lihat semua
            </button>
          </div>
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={onGoToProducts}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              {p.image ? (
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-8 w-8 shrink-0 rounded bg-gray-100" />
              )}
              <span className="min-w-0 flex-1 truncate text-gray-700">{p.name}</span>
              <span className="shrink-0 text-xs text-gray-400">{formatRupiah(p.price)}</span>
            </button>
          ))}
        </div>
      )}

      {customers.length > 0 && (
        <div className="border-t border-gray-50">
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <p className="text-xs font-semibold uppercase text-gray-400">Customer</p>
            <button type="button" onClick={onGoToCustomers} className="text-xs text-emerald-500 hover:underline">
              Lihat semua
            </button>
          </div>
          {customers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={onGoToCustomers}
              className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <span className="truncate text-gray-700">{c.full_name}</span>
              <span className="truncate text-xs text-gray-400">{c.email}</span>
            </button>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <div className="border-t border-gray-50">
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <p className="text-xs font-semibold uppercase text-gray-400">Pesanan</p>
            <button type="button" onClick={onGoToOrders} className="text-xs text-emerald-500 hover:underline">
              Lihat semua
            </button>
          </div>
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={onGoToOrders}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <span className="min-w-0 flex-1 truncate text-gray-700">
                {o.customer_name} — #{o.id.slice(0, 8)}
              </span>
              <span className="shrink-0 text-xs text-gray-400">{formatRupiah(o.total)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
