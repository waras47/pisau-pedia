// Meta (Facebook) Pixel — dipakai untuk iklan katalog & retargeting.
//
// ID produk yang dikirim (content_ids) WAJIB sama dengan kolom `id` di feed
// katalog Meta, yaitu UUID produk dari backend (bukan slug/SKU). Feed katalog
// dibuat oleh n8n: /webhook/meta-catalog-feed.
//
// Event pesanan juga dikirim dari server (Conversions API via n8n) dengan
// event_id `checkout_<order.id>` dan `purchase_<order.id>`; browser memakai
// eventID yang sama supaya Meta menghapus duplikatnya.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2371816299638154";

type PixelParams = Record<string, unknown>;

interface FbqFn {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FbqFn;
  loaded: boolean;
  version: string;
}

interface PixelWindow extends Window {
  fbq?: FbqFn;
  _fbq?: FbqFn;
}

let initialized = false;

/** Pasang snippet resmi Meta Pixel sekali saja (idempotent) lalu kembalikan fbq. */
function ensurePixel(): FbqFn | null {
  if (typeof window === "undefined" || !META_PIXEL_ID) return null;
  const w = window as PixelWindow;

  if (!w.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as FbqFn;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    w.fbq = fbq;
    if (!w._fbq) w._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  if (!initialized) {
    w.fbq("init", META_PIXEL_ID);
    initialized = true;
  }
  return w.fbq;
}

/** Kirim event standar Meta Pixel. `eventId` dipakai untuk deduplikasi dengan Conversions API. */
export function trackPixel(event: string, params?: PixelParams, eventId?: string) {
  const fbq = ensurePixel();
  if (!fbq) return;
  if (eventId) fbq("track", event, params ?? {}, { eventID: eventId });
  else fbq("track", event, params ?? {});
}

/**
 * Seperti trackPixel, tapi hanya sekali per `key` di browser ini (mis. supaya
 * Purchase tidak terkirim ulang saat halaman sukses di-refresh).
 */
export function trackPixelOnce(key: string, event: string, params?: PixelParams, eventId?: string) {
  if (typeof window === "undefined") return;
  const storageKey = `mp_sent_${key}`;
  try {
    if (localStorage.getItem(storageKey)) return;
    localStorage.setItem(storageKey, "1");
  } catch {
    // localStorage bisa diblokir (mode privat) — tetap kirim event-nya.
  }
  trackPixel(event, params, eventId);
}
