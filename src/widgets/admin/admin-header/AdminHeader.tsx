"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead,
  type NotificationApiItem,
  type NotificationModule,
} from "@/entities/notification/api/notification.api";

import { useAuth } from "@/features/auth/model/AuthProvider";

const NOTIFICATION_POLL_MS = 30000;

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationApiItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:h-16 sm:px-6">
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
        <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:flex">
          <SearchIcon />
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 md:w-64"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search button */}
        <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:hidden">
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
    </header>
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
