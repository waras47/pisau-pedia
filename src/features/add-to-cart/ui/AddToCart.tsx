"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { type Product } from "@/entities/product";
import { useCart } from "@/features/cart";
import { Button } from "@/shared/ui/Button";
import { IconButton } from "@/shared/ui/IconButton";

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = product.badge === "sold-out";

  function handleAdd() {
    addItem(product, quantity);
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border">
          <IconButton
            label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </IconButton>
          <span className="w-10 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <IconButton
            label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={16} />
          </IconButton>
        </div>

        <Button
          size="lg"
          className="flex-1"
          disabled={isSoldOut}
          onClick={handleAdd}
        >
          {isSoldOut ? "Sold Out" : "Add to Cart"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Pengiriman 2–4 hari kerja · Gratis ongkir pesanan di atas Rp 500.000
      </p>
    </div>
  );
}
