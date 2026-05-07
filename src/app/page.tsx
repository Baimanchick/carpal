import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedCars } from "@/components/home/featured-cars";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { Testimonials } from "@/components/home/testimonials";
import { CtaHost } from "@/components/home/cta-host";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <FeaturedCars />
      <PopularDestinations />
      <Testimonials />
      <CtaHost />
    </>
  );
}
