"use client";

import { formatPrice } from "@/entities/product";
import { useCart } from "@/features/cart";
import { CheckoutForm } from "@/features/checkout";
import { Container } from "@/shared/ui/Container";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const currency = items[0]?.currency ?? "EUR";

  return (
    <section className="py-16">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="mb-8 font-display text-3xl font-semibold tracking-tightest">
            Checkout
          </h1>
          <CheckoutForm />
        </div>

        <aside className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-8">
          <h2 className="mb-6 font-display text-lg font-semibold tracking-tightest">
            Order summary
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
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
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Shipping &amp; taxes calculated at the payment step.
              </p>
            </>
          )}
        </aside>
      </Container>
    </section>
  );
}
