"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { useCart } from "@/features/cart";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="py-24">
      <Container className="flex max-w-lg flex-col items-center gap-4 text-center">
        <CheckCircle2 size={56} className="text-green-600" />
        <h1 className="font-display text-3xl font-semibold tracking-tightest">
          Thank you for your order
        </h1>
        <p className="text-muted-foreground">
          Your payment was received. A confirmation email is on its way.
        </p>
        <Link href="/collections/japanese-knives">
          <Button>Continue shopping</Button>
        </Link>
      </Container>
    </section>
  );
}
