import { type ReactNode } from "react";

import { CartProvider } from "@/features/cart";
import { ThemeProvider } from "@/features/theme-toggle";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </ThemeProvider>
  );
}
