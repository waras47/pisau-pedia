import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";

export function AnnouncementBar() {
  return (
    <div className="bg-blue-600 text-white">
      <Container className="flex h-9 items-center justify-center text-center">
        <p className="text-xs tracking-wide">
          Free worldwide express shipping on orders over{" "}
          {siteConfig.freeShippingThreshold}€
        </p> 
      </Container>
    </div>
  );
}
