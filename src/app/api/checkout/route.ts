import { NextResponse } from "next/server";

import {
  type ComponentKind,
  priceComponent,
} from "@/entities/configurator";
import { getProductBySlug } from "@/entities/product";

// Xendit ID memproses IDR (integer). Harga produk diperlakukan sbg nominal IDR.
const CURRENCY = "IDR";

interface CheckoutPayload {
  email: string;
  name: string;
  items: {
    slug: string;
    quantity: number;
    component?: { kind: ComponentKind; refId: string };
  }[];
}

export async function POST(request: Request) {
  const secret = process.env.XENDIT_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Server is missing XENDIT_SECRET_KEY" },
      { status: 500 },
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, items } = body;
  if (!email || !items?.length) {
    return NextResponse.json(
      { error: "Email and at least one item are required" },
      { status: 400 },
    );
  }

  // Hitung ulang dari katalog (sumber kebenaran harga = server)
  const lineItems = [];
  let amount = 0;
  for (const { slug, quantity, component } of items) {
    if (quantity <= 0) continue;
    const qty = Math.floor(quantity);

    // Komponen configurator (blade / handle / accessory) → tiap satu jadi
    // line item terpisah, harga dihitung ulang dari data configurator.
    if (component) {
      const priced = priceComponent(component.kind, component.refId);
      if (!priced) continue;
      amount += priced.price * qty;
      lineItems.push({
        name: priced.name,
        quantity: qty,
        price: priced.price,
        category: priced.category,
      });
      continue;
    }

    // Produk katalog biasa
    const product = getProductBySlug(slug);
    if (!product) continue;
    amount += product.price * qty;
    lineItems.push({
      name: product.name,
      quantity: qty,
      price: product.price,
      category: product.category,
    });
  }

  if (amount <= 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const externalId = `order-${Date.now()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Buat invoice. Docs: https://docs.xendit.co/api-reference/#create-invoice
  const res = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: externalId,
      amount,
      currency: CURRENCY,
      payer_email: email,
      description: `Kissaki Knives order — ${lineItems.length} item(s)`,
      customer: { given_names: name, email },
      items: lineItems,
      success_redirect_url: `${siteUrl}/checkout/success?order=${externalId}`,
      failure_redirect_url: `${siteUrl}/checkout/failure?order=${externalId}`,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? "Failed to create invoice" },
      { status: res.status },
    );
  }

  return NextResponse.json({ invoiceUrl: data.invoice_url });
}
