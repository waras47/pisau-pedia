import { BrowseCategories } from "@/widgets/browse-categories";
import { CategoryBanners } from "@/widgets/category-banners";
import { ConfiguratorBanner } from "@/widgets/configurator-banner";
import { FeaturedCollection } from "@/widgets/featured-collection";
import { Hero } from "@/widgets/hero";
import { MonthlyPick } from "@/widgets/monthly-pick";
import { NewArrivals } from "@/widgets/new-arrivals";
import { QuizBanner } from "@/widgets/quiz-banner";
import { Testimonials } from "@/widgets/testimonials";
import { TrustBadges } from "@/widgets/trust-badges";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryBanners />
      <FeaturedCollection />
      <TrustBadges />
      <MonthlyPick />
      <Testimonials />
      <QuizBanner />
      <NewArrivals />
      <BrowseCategories />
      <ConfiguratorBanner />
    </>
  );
}
