"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { formatPrice } from "@/entities/product";
import { Button } from "@/shared/ui/Button";
import { IconButton } from "@/shared/ui/IconButton";

import { useCart } from "../model/CartProvider";

export function CartDrawer() {
  const {
    items,
    isOpen,
    subtotal,
    totalItems,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  // Tutup dengan Esc + kunci scroll body saat terbuka
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const currency = items[0]?.currency ?? "EUR";

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-lg font-semibold tracking-tightest">
            Cart ({totalItems})
          </h2>
          <IconButton label="Close cart" onClick={closeCart}>
            <X size={20} />
          </IconButton>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button variant="outline" onClick={closeCart}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-4 py-5">
                <div className="h-20 w-20 flex-none bg-muted" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.slug)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.category}
                  </span>

                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <IconButton
                        label="Decrease quantity"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </IconButton>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <IconButton
                        label="Increase quantity"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </IconButton>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 ? (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={closeCart}>
                <Button size="lg" className="w-full">
                  Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart}>
                <Button variant="outline" size="lg" className="w-full">
                  View cart
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
