"use client";

import { useState } from "react";

import { useCart } from "@/features/cart";
import { Button } from "@/shared/ui/Button";

export function CheckoutForm() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          name: `${form.get("firstName")} ${form.get("lastName")}`.trim(),
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
            component: i.component,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      // Redirect ke halaman pembayaran Xendit
      window.location.href = data.invoiceUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">
          Contact
        </legend>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className={inputClass}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-tightest">
          Shipping address
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            required
            placeholder="First name"
            className={inputClass}
          />
          <input
            name="lastName"
            required
            placeholder="Last name"
            className={inputClass}
          />
        </div>
        <input
          name="address"
          required
          placeholder="Address"
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            required
            placeholder="City"
            className={inputClass}
          />
          <input
            name="postalCode"
            required
            placeholder="Postal code"
            className={inputClass}
          />
        </div>
        <input
          name="phone"
          placeholder="Phone (optional)"
          className={inputClass}
        />
      </fieldset>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" size="lg" disabled={loading || items.length === 0}>
        {loading ? "Redirecting to payment…" : "Pay with Xendit"}
      </Button>
    </form>
  );
}
