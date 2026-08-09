import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";

export function AnnouncementBar() {
  return (
    <div className="bg-blue-600 text-white">
      <Container className="flex h-9 items-center justify-center text-center">
        <p className="text-xs tracking-wide">
          Gratis ongkir untuk pesanan di atas Rp{" "}
          {new Intl.NumberFormat("id-ID").format(siteConfig.freeShippingThreshold)}
        </p> 
      </Container>
    </div>
  );
}
