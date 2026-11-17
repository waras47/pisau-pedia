"use client";

import { createContext, type ReactNode,useContext, useMemo, useState } from "react";

import type { ShippingDestination, ShippingOption } from "@/entities/shipping/api/shipping.api";

interface CheckoutContextValue {
  destination: ShippingDestination | null;
  setDestination: (d: ShippingDestination | null) => void;
  shippingOption: ShippingOption | null;
  setShippingOption: (o: ShippingOption | null) => void;
  freeShipping: boolean;
  setFreeShipping: (v: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState<ShippingDestination | null>(null);
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(null);
  const [freeShipping, setFreeShipping] = useState(false);

  const value = useMemo(
    () => ({ destination, setDestination, shippingOption, setShippingOption, freeShipping, setFreeShipping }),
    [destination, shippingOption, freeShipping],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
