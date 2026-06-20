import {
  BrandsSection,
  CategoriesSection,
  CtaBannerSection,
  FeaturedProductsSection,
  FeaturesSection,
  HeroSection,
  TestimonialsSection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <BrandsSection />
      <CtaBannerSection />
      <TestimonialsSection />
    </>
  );
}
