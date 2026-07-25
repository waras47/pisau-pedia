import { type Metadata } from "next";

import { FAQ } from "@/widgets/faq";

export const metadata: Metadata = {
  title: "FAQ — Pisau Pedia",
  description: "Answers to common questions about ordering, shipping, returns, and caring for your knife.",
};

export default function FaqPage() {
  return <FAQ />;
}
