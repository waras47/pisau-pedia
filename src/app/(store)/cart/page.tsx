"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { IconButton } from "@/shared/ui/IconButton";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { useCart } from "@/features/cart";
import { useLocaleCurrency } from "@/features/locale-currency";

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCart();
  const { formatPrice, t } = useLocaleCurrency();
  const currency = items[0]?.currency ?? "EUR";

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="Your selection" title={`Cart (${totalItems})`} />

        {items.length === 0 ? (
          <div className="flex flex-col items-start gap-4 py-10">
            <p className="text-muted-foreground">{t("cart_empty")}</p>
            <Link href="/collections/japanese-knives">
              <Button>Browse knives</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-5 py-6">
                    {item.image ? (
                      <div className="h-24 w-24 flex-none overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-24 w-24 flex-none bg-muted" />
                    )}
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium hover:text-accent"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <IconButton
                            label="Decrease quantity"
                            className="h-9 w-9"
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                          >
                            <Minus size={14} />
                          </IconButton>
                          <span className="w-10 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <IconButton
                            label="Increase quantity"
                            className="h-9 w-9"
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                          >
                            <Plus size={14} />
                          </IconButton>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit border border-border bg-surface p-6">
              <h3 className="font-display text-lg font-semibold tracking-tightest">
                {t("order_summary")}
              </h3>
              <div className="mt-6 flex items-center justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-semibold">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="py-4 text-xs text-muted-foreground">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  {t("checkout")}
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </section>
  );
}
