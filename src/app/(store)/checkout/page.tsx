"use client";

import { Container } from "@/shared/ui/Container";

import { useCart } from "@/features/cart";
import { CheckoutForm, CheckoutProvider, useCheckout } from "@/features/checkout";
import { useLocaleCurrency } from "@/features/locale-currency";

function OrderSummary() {
  const { items, subtotal } = useCart();
  const { formatPrice, convert, currency: displayCurrency, t } = useLocaleCurrency();
  const { shippingOption, freeShipping } = useCheckout();
  const cartCurrency = items[0]?.currency ?? "EUR";

  // Shipping cost from RajaOngkir is always IDR; the catalog subtotal is in the
  // cart's source currency. Convert both into the display currency before summing.
  const shippingCostIdr = freeShipping ? 0 : shippingOption?.cost ?? 0;
  const grandTotal = convert(subtotal, cartCurrency) + convert(shippingCostIdr, "IDR");

  return (
    <aside className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-8">
      <h2 className="mb-6 font-display text-lg font-semibold tracking-tightest">{t("order_summary")}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("cart_empty")}</p>
      ) : (
        <>
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 flex-none bg-muted">
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity, item.currency)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="font-semibold">{formatPrice(subtotal, cartCurrency)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ongkir</span>
            <span className="font-semibold">
              {freeShipping ? "Gratis" : shippingOption ? formatPrice(shippingCostIdr, "IDR") : "—"}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatPrice(grandTotal, displayCurrency)}</span>
          </div>

          {!shippingOption && !freeShipping ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Pilih tujuan &amp; kurir untuk melihat ongkir.
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="mb-8 font-display text-3xl font-semibold tracking-tightest">Checkout</h1>
            <CheckoutForm />
          </div>
          <OrderSummary />
        </Container>
      </section>
    </CheckoutProvider>
  );
}
