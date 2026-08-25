import { type Metadata } from "next";

import { TermsOfService } from "@/widgets/policy";

export const metadata: Metadata = {
  title: "Terms of Service — Pisau Pedia",
  description: "The terms and conditions governing your use of Pisaupedia.",
};

export default function TermsOfServicePage() {
  return <TermsOfService />;
}
