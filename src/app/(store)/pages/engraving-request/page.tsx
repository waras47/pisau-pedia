import { type Metadata } from "next";

import { EngravingService } from "@/widgets/engraving-service";

export const metadata: Metadata = {
  title: "Custom Engraving — Kissaki Knives",
  description:
    "Personalize your knife with custom engraving. Send us your design details and we'll reply with a quote within 1 business day.",
};

export default function EngravingRequestPage() {
  return <EngravingService />;
}
