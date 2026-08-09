"use client";

import { useEffect, useState } from "react";

import { getActiveSitePromo, type SitePromoItem } from "@/entities/site-promo/api/site-promo.api";

const LS_KEY = "pisaupedia_site_promo_dismissed";

export function SitePromoPopup() {
  const [promo, setPromo] = useState<SitePromoItem | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(LS_KEY);
    if (dismissed) {
      try {
        const data = JSON.parse(dismissed);
        if (data.id && data.ts) {
          const hoursSince = (Date.now() - data.ts) / 3_600_000;
          if (hoursSince < 24) return;
        }
      } catch {
        return;
      }
    }

    const timer = setTimeout(() => {
      getActiveSitePromo()
        .then((data) => {
          if (data) {
            setPromo(data);
            setVisible(true);
          }
        })
        .catch(() => {});
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!promo || !visible) return null;

  const handleDismissBubble = () => {
    setVisible(false);
    localStorage.setItem(LS_KEY, JSON.stringify({ id: promo.id, ts: Date.now() }));
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(LS_KEY, JSON.stringify({ id: promo.id, ts: Date.now() }));
    setTimeout(() => setVisible(false), 300);
  };

  if (open) {
    return (
      <>
        <div className="fixed inset-0 z-[70] bg-black/50 transition-opacity" onClick={handleClose} />
        <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-gray-600 hover:bg-black/20 dark:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Left: promo details */}
              <div className="flex flex-1 flex-col justify-center p-8">
                <p className="text-sm font-medium uppercase tracking-widest text-emerald-600">Promo Spesial</p>
                <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">{promo.title}</h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-red-600">{promo.discount_percent}%</span>
                  <span className="text-xl font-bold text-gray-600 dark:text-gray-300">OFF</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Untuk seluruh produk</p>
                {promo.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{promo.description}</p>
                )}
                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                  Berlaku: {new Date(promo.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  {" — "}
                  {new Date(promo.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 w-full rounded-lg bg-red-600 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 sm:w-auto sm:px-8"
                >
                  Belanja Sekarang
                </button>
              </div>

              {/* Right: image */}
              {promo.popup_image && (
                <div className="hidden sm:flex sm:w-[45%] items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                  <img
                    src={promo.popup_image}
                    alt={promo.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Floating bubble
  return (
    <div className="fixed bottom-24 right-4 z-[60] sm:bottom-6 sm:right-6">
      <div className="group relative flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl hover:scale-105">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <span className="text-lg">🔥</span>
          <span>{promo.discount_percent}% OFF Semua Produk!</span>
        </button>
        <button
          type="button"
          onClick={handleDismissBubble}
          className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] text-white hover:bg-white/30 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
