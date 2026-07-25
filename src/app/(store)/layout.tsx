import { type ReactNode } from "react";

import { AuthProvider } from "@/features/auth/model/AuthProvider";
import { CartProvider } from "@/features/cart";
import { LocaleProvider } from "@/features/locale-currency";
import { ThemeProvider } from "@/features/theme-toggle";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { PromoPopup } from "@/widgets/promo-popup/PromoPopup";
import { WhatsAppButton } from "@/widgets/whatsapp-button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
            <PromoPopup />
          </CartProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
