"use client";

import { useEffect, useState } from "react";

import { getPromoPopup, type PromoPopup as PromoPopupData } from "@/entities/coupon/api/coupon.api";
import { subscribeNewsletter } from "@/entities/newsletter/api/newsletter.api";

const LS_KEY = "pisaupedia_promo_dismissed";

export function PromoPopup() {
  const [promo, setPromo] = useState<PromoPopupData | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(LS_KEY)) return;

    const timer = setTimeout(() => {
      getPromoPopup()
        .then((data) => {
          if (data) {
            setPromo(data);
            setVisible(true);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!promo || !visible) return null;

  const discountLabel =
    promo.type === "percentage"
      ? `${promo.value}%`
      : promo.type === "free_shipping"
        ? "FREE SHIPPING"
        : `Rp${promo.value.toLocaleString("id-ID")}`;

  const handleDismissBubble = () => {
    setVisible(false);
    localStorage.setItem(LS_KEY, "1");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Masukkan email yang valid");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await subscribeNewsletter(email.trim(), "popup");
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(LS_KEY, "1");
    setTimeout(() => setVisible(false), 300);
  };

  if (open) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-[70] bg-black/50 transition-opacity" onClick={handleClose} />

        {/* Modal */}
        <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-10 text-center text-white">
              <p className="text-sm font-medium uppercase tracking-widest opacity-80">Exclusive Offer</p>
              <p className="mt-2 text-5xl font-black">{discountLabel}</p>
              <p className="mt-1 text-lg font-semibold">OFF</p>
              <p className="mt-3 text-sm opacity-80">untuk pesanan pertama Anda</p>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              {!submitted ? (
                <>
                  <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Masukkan email Anda untuk mendapatkan kode diskon eksklusif
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="email@anda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : `Ya, Saya Mau Diskon ${discountLabel}!`}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Tidak, terima kasih
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">Selamat!</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gunakan kode di bawah saat checkout:</p>
                  <div className="mt-4 rounded-lg bg-gray-100 px-6 py-3 dark:bg-gray-800">
                    <span className="font-mono text-2xl font-black tracking-wider text-emerald-600">{promo.code}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Diskon {discountLabel} untuk pesanan pertama</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-5 rounded-lg bg-emerald-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    Mulai Belanja
                  </button>
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
    <div className="fixed bottom-24 left-4 z-[60] sm:bottom-6 sm:left-6">
      <div className="group relative flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:scale-105">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <span className="text-lg">🏷️</span>
          <span>{discountLabel} OFF?</span>
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
