import { HeadphonesIcon, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

const badges = [
  {
    icon: Truck,
    title: "Express Worldwide Shipping",
    description: `10€ flat rate via DHL Express. Free on orders over ${siteConfig.freeShippingThreshold}€.`,
  },
  {
    icon: ShieldCheck,
    title: "No Duties & Fees",
    description: "We cover import fees worldwide. All prices shown are final.",
  },
  {
    icon: RotateCcw,
    title: "Easy 30-Day Returns",
    description: "Something not right? Send it back, no questions asked.",
  },
  {
    icon: HeadphonesIcon,
    title: "Attentive Support",
    description: "Real people who know the blades. Usually a few hours to reply.",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="Customer first" title="Why shop with us" align="center" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <Icon size={26} className="text-accent" />
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
