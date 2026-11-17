import { type Metadata } from "next";

import { PrivacyPolicy } from "@/widgets/policy";

export const metadata: Metadata = {
  title: "Privacy Policy — Pisau Pedia",
  description: "How Pisaupedia collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
