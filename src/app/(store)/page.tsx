import { BrowseCategories } from "@/widgets/browse-categories";
import { CategoryBanners } from "@/widgets/category-banners";
import { ConfiguratorBanner } from "@/widgets/configurator-banner";
import { FeaturedCollection } from "@/widgets/featured-collection";
import { Hero } from "@/widgets/hero";
import { MonthlyPick } from "@/widgets/monthly-pick";
import { NewArrivals } from "@/widgets/new-arrivals";
import { PromoBanner } from "@/widgets/promo-banner";
import { Testimonials } from "@/widgets/testimonials";
import { TrustBadges } from "@/widgets/trust-badges";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <CategoryBanners />
      <FeaturedCollection />
      <TrustBadges />
      <MonthlyPick />
      <Testimonials />
      <NewArrivals />
      <BrowseCategories />
      <ConfiguratorBanner />
    </>
  );
}
