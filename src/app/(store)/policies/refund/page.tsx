import { type Metadata } from "next";

import { RefundPolicy } from "@/widgets/policy";

export const metadata: Metadata = {
  title: "Refund Policy — Pisau Pedia",
  description:
    "Kebijakan pengembalian 30 hari, penggantian barang rusak, dan garansi cacat produksi Pisaupedia.",
};

export default function RefundPolicyPage() {
  return <RefundPolicy />;
}
