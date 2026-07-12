import { type ReactNode } from "react";

import { CartProvider } from "@/features/cart";
import { LocaleProvider } from "@/features/locale-currency";
import { ThemeProvider } from "@/features/theme-toggle";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { WhatsAppButton } from "@/widgets/whatsapp-button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
