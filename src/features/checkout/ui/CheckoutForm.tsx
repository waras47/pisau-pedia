"use client";

import { useEffect, useMemo, useState } from "react";

import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";

import { validateCoupon, type ValidateCouponResult } from "@/entities/coupon/api/coupon.api";
import { createOrder } from "@/entities/order/api/order.api";
import {
  calculateShippingCost,
  searchDestinations,
  type ShippingDestination,
  type ShippingOption,
} from "@/entities/shipping/api/shipping.api";

import { useCart } from "@/features/cart";

import { useCheckout } from "../model/CheckoutProvider";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const {
    destination,
    setDestination,
    shippingOption,
    setShippingOption,
    setFreeShipping,
  } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Destination autocomplete
  const [destQuery, setDestQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [destResults, setDestResults] = useState<ShippingDestination[]>([]);
  const [destOpen, setDestOpen] = useState(false);
  const [destLoading, setDestLoading] = useState(false);

  // Courier options
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const catalogItems = useMemo(() => items.filter((i) => !i.component), [items]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(destQuery), 350);
    return () => clearTimeout(t);
  }, [destQuery]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setDestResults([]);
      return;
    }
    let cancelled = false;
    setDestLoading(true);
    searchDestinations(debouncedQuery.trim())
      .then((res) => {
        if (!cancelled) setDestResults(res);
      })
      .catch(() => {
        if (!cancelled) setDestResults([]);
      })
      .finally(() => {
        if (!cancelled) setDestLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Fetch courier options whenever a destination is chosen (and cart changes).
  useEffect(() => {
    if (!destination || catalogItems.length === 0) {
      setShippingOptions([]);
      setShippingOption(null);
      return;
    }
    let cancelled = false;
    setShippingLoading(true);
    setShippingError(null);
    setShippingOption(null);
    calculateShippingCost(
      String(destination.id),
      catalogItems.map((i) => ({ product_slug: i.slug, quantity: i.quantity })),
    )
      .then((opts) => {
        if (!cancelled) setShippingOptions(opts);
      })
      .catch((err) => {
        if (!cancelled) {
          setShippingOptions([]);
          setShippingError(err instanceof HttpError ? err.message : "Gagal memuat ongkir");
        }
      })
      .finally(() => {
        if (!cancelled) setShippingLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, catalogItems]);

  function selectDestination(d: ShippingDestination) {
    setDestination(d);
    setDestQuery(d.label);
    setDestOpen(false);
  }

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setValidatingCoupon(true);
    try {
      const result = await validateCoupon(couponCode.trim().toUpperCase(), subtotal);
      setAppliedCoupon(result);
      setFreeShipping(!!result.free_shipping);
    } catch (err) {
      setAppliedCoupon(null);
      setFreeShipping(false);
      setCouponError(err instanceof HttpError ? err.message : "Kode kupon tidak valid");
    } finally {
      setValidatingCoupon(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (catalogItems.length === 0) {
      setError("Custom configurator items aren't supported at checkout yet.");
      return;
    }
    if (!destination) {
      setError("Pilih tujuan pengiriman terlebih dahulu.");
      return;
    }
    if (!shippingOption) {
      setError("Pilih kurir pengiriman terlebih dahulu.");
      return;
    }

    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const order = await createOrder({
        customer_name: `${form.get("firstName")} ${form.get("lastName")}`.trim(),
        customer_email: String(form.get("email")),
        customer_phone: form.get("phone") ? String(form.get("phone")) : undefined,
        shipping_address: String(form.get("address")),
        shipping_city: destination.city_name,
        shipping_province: destination.province_name,
        shipping_postal_code: destination.zip_code || String(form.get("postalCode")),
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        destination_id: String(destination.id),
        courier: shippingOption.code,
        service: shippingOption.service,
        items: catalogItems.map((i) => ({ product_slug: i.slug, quantity: i.quantity })),
      });

      window.location.href = order.invoice_url ?? `/checkout/success?order=${order.id}`;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">Contact</legend>
        <input type="email" name="email" required placeholder="Email" className={inputClass} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">Shipping address</legend>
        <div className="grid grid-cols-2 gap-3">
          <input name="firstName" required placeholder="First name" className={inputClass} />
          <input name="lastName" required placeholder="Last name" className={inputClass} />
        </div>
        <input name="address" required placeholder="Alamat lengkap (jalan, no rumah)" className={inputClass} />

        {/* Destination autocomplete */}
        <div className="relative">
          <input
            value={destQuery}
            onChange={(e) => {
              setDestQuery(e.target.value);
              setDestOpen(true);
              if (destination) setDestination(null);
            }}
            onFocus={() => setDestOpen(true)}
            placeholder="Kota / kecamatan / kode pos tujuan"
            className={inputClass}
            autoComplete="off"
          />
          {destOpen && (destResults.length > 0 || destLoading) && (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto border border-border bg-background shadow-lg">
              {destLoading ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">Mencari...</p>
              ) : (
                destResults.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => selectDestination(d)}
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                  >
                    {d.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="postalCode" placeholder="Kode pos (opsional)" className={inputClass} />
          <input name="phone" placeholder="Phone (optional)" className={inputClass} />
        </div>
      </fieldset>

      {/* Courier selection */}
      {destination && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">Pengiriman</legend>
          {shippingLoading ? (
            <p className="text-sm text-muted-foreground">Menghitung ongkir...</p>
          ) : shippingError ? (
            <p className="text-sm text-red-600">{shippingError}</p>
          ) : shippingOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada layanan pengiriman untuk tujuan ini.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {shippingOptions.map((opt) => {
                const active = shippingOption?.code === opt.code && shippingOption?.service === opt.service;
                return (
                  <button
                    key={`${opt.code}-${opt.service}`}
                    type="button"
                    onClick={() => setShippingOption(opt)}
                    className={`flex items-center justify-between border px-3 py-2.5 text-left text-sm transition-colors ${
                      active ? "border-accent bg-accent/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <span>
                      <span className="font-medium">{opt.name} — {opt.service}</span>
                      <span className="block text-xs text-muted-foreground">
                        {opt.description}
                        {opt.etd ? ` · estimasi ${opt.etd}` : ""}
                      </span>
                    </span>
                    <span className="font-semibold">{formatRupiah(opt.cost)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">Coupon</legend>
        {appliedCoupon ? (
          <div className="flex items-center justify-between border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm">
            <span>
              Kode <strong className="font-mono">{appliedCoupon.code}</strong> diterapkan
              {appliedCoupon.free_shipping ? " (gratis ongkir)" : ` — hemat Rp${appliedCoupon.discount_amount.toLocaleString("id-ID")}`}
            </span>
            <button
              type="button"
              onClick={() => {
                setAppliedCoupon(null);
                setCouponCode("");
                setFreeShipping(false);
              }}
              className="text-xs text-muted-foreground underline"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Kode kupon"
              className={inputClass}
            />
            <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode.trim()}>
              {validatingCoupon ? "..." : "Terapkan"}
            </Button>
          </div>
        )}
        {couponError ? <p className="text-sm text-red-600">{couponError}</p> : null}
      </fieldset>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" size="lg" disabled={loading || items.length === 0}>
        {loading ? "Memproses pesanan…" : "Buat Pesanan"}
      </Button>
    </form>
  );
}
