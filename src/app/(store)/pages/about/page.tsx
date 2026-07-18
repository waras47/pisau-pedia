import { type Metadata } from "next";

import { About } from "@/widgets/about";

export const metadata: Metadata = {
  title: "About Us — Kissaki Knives",
  description:
    "Hand-forged Japanese kitchen knives, sourced directly from small workshops in Sakai, Japan since 1998.",
};

export default function AboutPage() {
  return <About />;
}
