import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";
import { Logo } from "@/shared/ui/Logo";

import { NewsletterForm } from "@/features/newsletter-signup";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Japanese Knives", href: "/collections/knives" },
      { label: "Sharpening Tools", href: "/collections/sharpening" },
      { label: "Kitchen Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/pages/faq" },
      { label: "Sharpening Service", href: "/pages/sharpening-repairs" },
      { label: "Contact Us", href: "/pages/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/pages/about" },
      { label: "Reviews", href: "/pages/reviews" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
  { label: "Facebook", href: siteConfig.social.facebook, icon: Facebook },
  { label: "YouTube", href: siteConfig.social.youtube, icon: Youtube },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center">
            <Logo className="h-9 w-auto" />
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest2 text-muted-foreground">
                {column.title}
              </span>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/90 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest2 text-muted-foreground">
            Newsletter
          </span>
          <p className="text-sm text-muted-foreground">
            Get 10% off your first order, plus blade care tips and new arrivals.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/policies/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/policies/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/policies/refund" className="hover:text-accent">
              Refund Policy
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
