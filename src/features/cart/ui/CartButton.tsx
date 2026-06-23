"use client";

import { ShoppingBag } from "lucide-react";

import { IconButton } from "@/shared/ui/IconButton";

import { useCart } from "../model/CartProvider";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <IconButton
      label={`Cart, ${totalItems} items`}
      className="relative"
      onClick={openCart}
    >
      <ShoppingBag size={19} />
      {totalItems > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-copper text-[10px] text-copper-foreground">
          {totalItems}
        </span>
      ) : null}
    </IconButton>
  );
}
