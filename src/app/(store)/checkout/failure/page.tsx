"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export default function CheckoutFailurePage() {
  return (
    <section className="py-24">
      <Container className="flex max-w-lg flex-col items-center gap-4 text-center">
        <XCircle size={56} className="text-red-600" />
        <h1 className="font-display text-3xl font-semibold tracking-tightest">
          Payment not completed
        </h1>
        <p className="text-muted-foreground">
          Something went wrong or the payment was cancelled. Your cart is still
          saved.
        </p>
        <Link href="/checkout">
          <Button>Try again</Button>
        </Link>
      </Container>
    </section>
  );
}
